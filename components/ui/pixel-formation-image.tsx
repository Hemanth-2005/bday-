'use client'

import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'

interface PixelFormationImageProps {
  src: string
  progress: MotionValue<number>
  className?: string
}

const vertexShader = `
  attribute vec3 targetPosition;
  attribute vec3 startPosition;
  attribute float randomOffset;
  attribute float size;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;

    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }

  void main() {
    float delay = randomOffset * 0.18;
    float adjustedProgress = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
    float eased = easeOutCubic(adjustedProgress);

    vec3 noiseSeed = startPosition * 0.014 + vec3(0.0, 0.0, uTime * 0.12);
    vec3 noiseOffset = vec3(
      snoise(noiseSeed),
      snoise(noiseSeed + 37.0),
      snoise(noiseSeed + 79.0)
    ) * 32.0 * (1.0 - eased);

    vec3 currentPosition = mix(startPosition, targetPosition, eased);
    currentPosition += noiseOffset;
    currentPosition.z += sin((randomOffset + eased) * 6.28318) * 40.0 * (1.0 - eased);

    vec4 mvPosition = modelViewMatrix * vec4(currentPosition, 1.0);
    float perspectiveScale = 280.0 / max(-mvPosition.z, 1.0);
    gl_PointSize = size * perspectiveScale * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;

    vColor = color;
    vAlpha = mix(0.08, 0.92, eased);
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uProgress;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float finalTightness = smoothstep(0.48, 1.0, uProgress);
    float coreRadius = mix(0.42, 0.56, finalTightness);
    float glowRadius = mix(0.68, 0.88, finalTightness);
    float core = 1.0 - smoothstep(0.0, coreRadius, dist);
    float glow = 1.0 - smoothstep(0.0, glowRadius, dist);
    glow = pow(glow, mix(1.5, 1.0, finalTightness));

    float alpha = max(core, glow * mix(0.42, 0.9, finalTightness)) * vAlpha;
    vec3 finalColor = vColor * (1.12 + glow * mix(0.52, 0.76, finalTightness));

    gl_FragColor = vec4(finalColor, alpha);
  }
`

export default function PixelFormationImage({
  src,
  progress,
  className = '',
}: PixelFormationImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let frameId = 0
    let disposed = false

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 2000)
    camera.position.z = 500

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    let geometry: THREE.BufferGeometry | null = null
    let material: THREE.ShaderMaterial | null = null
    let particles: THREE.Points | null = null
    let renderedProgress = 0

    const updateSize = () => {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      const aspect = width / height
      const frustumSize = 1000

      camera.left = (-frustumSize * aspect) / 2
      camera.right = (frustumSize * aspect) / 2
      camera.top = frustumSize / 2
      camera.bottom = -frustumSize / 2
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))

      if (material) {
        material.uniforms.uPixelRatio.value = renderer.getPixelRatio()
      }
    }

    const createParticles = (image: HTMLImageElement) => {
      const maxDimension = 720
      const scaleRatio = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
      const width = Math.max(1, Math.round(image.naturalWidth * scaleRatio))
      const height = Math.max(1, Math.round(image.naturalHeight * scaleRatio))

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.drawImage(image, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height).data

      const maxParticles = 320000
      const totalPixels = width * height
      const sampleStep =
        totalPixels <= maxParticles
          ? 1
          : Math.max(1, Math.ceil(Math.sqrt(totalPixels / maxParticles)))
      const pixels: Array<{ x: number; y: number; r: number; g: number; b: number }> = []

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const index = (y * width + x) * 4
          const alpha = imageData[index + 3]

          if (alpha < 8) continue

          pixels.push({
            x: x - width / 2,
            y: -(y - height / 2),
            r: imageData[index] / 255,
            g: imageData[index + 1] / 255,
            b: imageData[index + 2] / 255,
          })
        }
      }

      const count = pixels.length
      const positions = new Float32Array(count * 3)
      const targetPositions = new Float32Array(count * 3)
      const startPositions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const randomOffsets = new Float32Array(count)
      const sizes = new Float32Array(count)

      const scaledImageWidth = width * 2.16
      const scaledImageHeight = height * 2.16

      for (let i = 0; i < count; i += 1) {
        const pixel = pixels[i]
        const baseIndex = i * 3
        const angle = Math.random() * Math.PI * 2
        const distance = 230 + Math.random() * 420
        const edgeBias = Math.random()

        const scatterX =
          Math.cos(angle) * distance +
          (edgeBias > 0.5 ? (Math.random() - 0.2) * 220 : (Math.random() - 0.8) * 220)
        const scatterY = Math.sin(angle) * distance * 0.88 + (Math.random() - 0.5) * 120
        const scatterZ = (Math.random() - 0.5) * 380

        targetPositions[baseIndex] = (pixel.x / width) * scaledImageWidth
        targetPositions[baseIndex + 1] = (pixel.y / height) * scaledImageHeight
        targetPositions[baseIndex + 2] = 0

        startPositions[baseIndex] = scatterX
        startPositions[baseIndex + 1] = scatterY
        startPositions[baseIndex + 2] = scatterZ

        positions[baseIndex] = scatterX
        positions[baseIndex + 1] = scatterY
        positions[baseIndex + 2] = scatterZ

        colors[baseIndex] = pixel.r
        colors[baseIndex + 1] = pixel.g
        colors[baseIndex + 2] = pixel.b

        randomOffsets[i] = Math.random()
        sizes[i] = 2.35 + Math.random() * 1.6
      }

      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3))
      geometry.setAttribute('startPosition', new THREE.BufferAttribute(startPositions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      material = new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uPixelRatio: { value: renderer.getPixelRatio() },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
        vertexColors: true,
      })

      particles = new THREE.Points(geometry, material)
      scene.add(particles)
    }

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    image.onload = () => {
      if (disposed) return
      createParticles(image)
      updateSize()
    }

    const animate = () => {
      if (disposed) return

      frameId = window.requestAnimationFrame(animate)

      if (material) {
        const targetProgress = progress.get()
        renderedProgress += (targetProgress - renderedProgress) * 0.08
        material.uniforms.uProgress.value = renderedProgress
        material.uniforms.uTime.value = performance.now() * 0.001
      }

      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(() => updateSize())
    resizeObserver.observe(container)
    animate()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()

      if (particles) {
        scene.remove(particles)
      }

      geometry?.dispose()
      material?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progress, src])

  return <div ref={containerRef} className={className} />
}
