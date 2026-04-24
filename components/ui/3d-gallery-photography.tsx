'use client'

import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

type ImageItem = string | { src: string; alt?: string }

interface FadeSettings {
  fadeIn: {
    start: number
    end: number
  }
  fadeOut: {
    start: number
    end: number
  }
}

interface BlurSettings {
  blurIn: {
    start: number
    end: number
  }
  blurOut: {
    start: number
    end: number
  }
  maxBlur: number
}

interface InfiniteGalleryProps {
  images: ImageItem[]
  speed?: number
  zSpacing?: number
  visibleCount?: number
  falloff?: { near: number; far: number }
  fadeSettings?: FadeSettings
  blurSettings?: BlurSettings
  interactive?: boolean
  scrollProgress?: number
  scrollCycles?: number
  className?: string
  style?: React.CSSProperties
}

interface PlaneData {
  index: number
  z: number
  imageIndex: number
  x: number
  y: number
}

const DEFAULT_DEPTH_RANGE = 50
const MAX_HORIZONTAL_OFFSET = 8
const MAX_VERTICAL_OFFSET = 8

const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          flagWave += sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
        }

        pos.z -= curve + clothEffect + flagWave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);

        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(512.0, 512.0);
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }

          color = blurred / total;
        }

        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  })

function GalleryScene({
  images,
  speed = 1,
  zSpacing = 2.5,
  visibleCount = 8,
  falloff = { near: 0.5, far: 12 },
  scrollProgress,
  scrollCycles = 2.4,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.9, end: 1.0 },
    maxBlur: 3.0,
  },
  interactive = true,
}: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
  const { gl } = useThree()
  const velocityRef = useRef(0)
  const autoPlayRef = useRef(true)
  const lastInteractionRef = useRef(0)
  const previousProgressRef = useRef(scrollProgress ?? 0)
  const meshRefs = useRef<Array<THREE.Mesh | null>>([])

  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  )

  const textures = useTexture(normalizedImages.map((img) => img.src))

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  )

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = []

    for (let index = 0; index < visibleCount; index += 1) {
      const horizontalAngle = (index * 2.618) % (Math.PI * 2)
      const verticalAngle = (index * 1.618 + Math.PI / 3) % (Math.PI * 2)
      const horizontalRadius = (index % 3) * 1.2
      const verticalRadius = ((index + 1) % 4) * 0.8

      positions.push({
        x: (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET) / 3,
        y: (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4,
      })
    }

    return positions
  }, [visibleCount])

  const totalImages = normalizedImages.length
  const depthRange = Math.max(DEFAULT_DEPTH_RANGE, visibleCount * zSpacing * 2)

  const planesData = useRef<PlaneData[]>(
    Array.from({ length: visibleCount }, (_, index) => ({
      index,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * index) % depthRange : 0,
      imageIndex: totalImages > 0 ? index % totalImages : 0,
      x: spatialPositions[index]?.x ?? 0,
      y: spatialPositions[index]?.y ?? 0,
    }))
  )

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, index) => ({
      index,
      z: visibleCount > 0 ? ((depthRange / Math.max(visibleCount, 1)) * index) % depthRange : 0,
      imageIndex: totalImages > 0 ? index % totalImages : 0,
      x: spatialPositions[index]?.x ?? 0,
      y: spatialPositions[index]?.y ?? 0,
    }))
  }, [depthRange, spatialPositions, totalImages, visibleCount])

  const planeIndexes = useMemo(
    () => Array.from({ length: visibleCount }, (_, index) => index),
    [visibleCount]
  )

  useEffect(() => {
    lastInteractionRef.current = Date.now()
  }, [])

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose())
    }
  }, [materials])

  useEffect(() => {
    if (!interactive) {
      return
    }

    const handleWheel = (event: WheelEvent) => {
      velocityRef.current += event.deltaY * 0.005 * speed
      autoPlayRef.current = false
      lastInteractionRef.current = Date.now()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        velocityRef.current -= 0.55 * speed
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        velocityRef.current += 0.55 * speed
      }

      autoPlayRef.current = false
      lastInteractionRef.current = Date.now()
    }

    gl.domElement.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gl, interactive, speed])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0
    const totalRange = depthRange
    const halfRange = totalRange / 2
    const scrollDriven = typeof scrollProgress === 'number'

    if (scrollDriven) {
      const progressDelta = scrollProgress - previousProgressRef.current
      velocityRef.current = THREE.MathUtils.clamp(progressDelta * 42, -2.4, 2.4)
      previousProgressRef.current = scrollProgress
    } else {
      if (Date.now() - lastInteractionRef.current > 2600) {
        autoPlayRef.current = true
      }

      if (autoPlayRef.current) {
        velocityRef.current += 0.12 * delta * speed
      }

      velocityRef.current *= 0.96
    }

    planesData.current.forEach((plane, index) => {
      let wrapsForward = 0
      let wrapsBackward = 0
      let newZ = plane.z

      if (scrollDriven) {
        const baseZ =
          visibleCount > 0 ? ((totalRange / Math.max(visibleCount, 1)) * index) % totalRange : 0
        const traveled = scrollProgress * totalRange * scrollCycles
        const wrappedCycles = Math.floor((baseZ + traveled) / totalRange)
        newZ = baseZ + traveled
        if (totalImages > 0) {
          const offset = wrappedCycles * Math.max(visibleCount, 1)
          plane.imageIndex = ((index + offset) % totalImages + totalImages) % totalImages
        }
      } else {
        newZ = plane.z + velocityRef.current * delta * 10

        if (newZ >= totalRange) {
          wrapsForward = Math.floor(newZ / totalRange)
          newZ -= totalRange * wrapsForward
        } else if (newZ < 0) {
          wrapsBackward = Math.ceil(-newZ / totalRange)
          newZ += totalRange * wrapsBackward
        }
      }

      if (!scrollDriven && wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages
      }

      if (!scrollDriven && wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange
      plane.x = spatialPositions[index]?.x ?? 0
      plane.y = spatialPositions[index]?.y ?? 0

      const normalizedPosition = plane.z / totalRange
      const worldZ = plane.z - halfRange
      const distanceFromCamera = Math.abs(worldZ)
      const falloffStrength = THREE.MathUtils.clamp(
        1 - (distanceFromCamera - falloff.near) / Math.max(falloff.far - falloff.near, 0.001),
        0,
        1
      )
      let opacity = 1

      if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
        opacity =
          (normalizedPosition - fadeSettings.fadeIn.start) /
          (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start)
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0
      } else if (
        normalizedPosition >= fadeSettings.fadeOut.start &&
        normalizedPosition <= fadeSettings.fadeOut.end
      ) {
        opacity =
          1 -
          (normalizedPosition - fadeSettings.fadeOut.start) /
            (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start)
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0
      }

      let blur = 0

      if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
        blur =
          blurSettings.maxBlur *
          (1 -
            (normalizedPosition - blurSettings.blurIn.start) /
              (blurSettings.blurIn.end - blurSettings.blurIn.start))
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur
      } else if (
        normalizedPosition >= blurSettings.blurOut.start &&
        normalizedPosition <= blurSettings.blurOut.end
      ) {
        blur =
          blurSettings.maxBlur *
          ((normalizedPosition - blurSettings.blurOut.start) /
            (blurSettings.blurOut.end - blurSettings.blurOut.start))
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur
      }

      const material = materials[index]
      const texture = textures[plane.imageIndex]
      const mesh = meshRefs.current[index]

      if (!material || !texture || !mesh) {
        return
      }

      material.uniforms.time.value = time
      material.uniforms.scrollForce.value = velocityRef.current
      material.uniforms.opacity.value = Math.max(0, Math.min(1, opacity * falloffStrength))
      material.uniforms.blurAmount.value = Math.max(
        0,
        Math.min(blurSettings.maxBlur, blur + (1 - falloffStrength) * 1.6)
      )
      material.uniforms.map.value = texture

      const image = texture.image as { width?: number; height?: number } | undefined
      const aspect = image?.width && image?.height ? image.width / image.height : 1
      const scale = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1]

      mesh.position.set(plane.x, plane.y, plane.z - halfRange)
      mesh.scale.set(scale[0], scale[1], scale[2])
    })
  })

  if (normalizedImages.length === 0) {
    return null
  }

  return (
    <>
      {planeIndexes.map((index) => (
        <mesh
          key={index}
          ref={(element) => {
            meshRefs.current[index] = element
          }}
          material={materials[index]}
          onPointerEnter={() => {
            materials[index].uniforms.isHovered.value = 1
          }}
          onPointerLeave={() => {
            materials[index].uniforms.isHovered.value = 0
          }}
        >
          <planeGeometry args={[1, 1, 32, 32]} />
        </mesh>
      ))}
    </>
  )
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  )

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
        {normalizedImages.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className="h-32 w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  )
}

export default function InfiniteGallery({
  images,
  className = 'h-96 w-full',
  style,
  zSpacing,
  falloff,
  scrollProgress,
  scrollCycles,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  },
  speed,
  visibleCount,
  interactive = true,
}: InfiniteGalleryProps) {
  const [webglSupported] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return Boolean(gl)
    } catch {
      return false
    }
  })

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    )
  }

  return (
    <div className={className} style={style}>
      <Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <GalleryScene
          images={images}
          speed={speed}
          zSpacing={zSpacing}
          visibleCount={visibleCount}
          falloff={falloff}
          scrollProgress={scrollProgress}
          scrollCycles={scrollCycles}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
          interactive={interactive}
        />
      </Canvas>
    </div>
  )
}
