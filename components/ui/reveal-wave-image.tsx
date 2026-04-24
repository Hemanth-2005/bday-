'use client'

import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRevealRadius;
  uniform float uRevealSoftness;
  uniform float uPixelSize;
  uniform float uMouseActive;

  uniform float uWaveSpeed;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;
  uniform float uMouseRadius;

  varying vec2 vUv;

  float bayer4x4(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int index = x + y * 4;

    float pattern[16];
    pattern[0] = 0.0; pattern[1] = 8.0; pattern[2] = 2.0; pattern[3] = 10.0;
    pattern[4] = 12.0; pattern[5] = 4.0; pattern[6] = 14.0; pattern[7] = 6.0;
    pattern[8] = 3.0; pattern[9] = 11.0; pattern[10] = 1.0; pattern[11] = 9.0;
    pattern[12] = 15.0; pattern[13] = 7.0; pattern[14] = 13.0; pattern[15] = 5.0;

    for (int i = 0; i < 16; i++) {
      if (i == index) return pattern[i] / 16.0;
    }

    return 0.0;
  }

  void main() {
    vec2 uv = vUv;

    float time = uTime;
    float waveStrength = uWaveAmplitude * 0.1;

    float wave1 = sin(uv.y * uWaveFrequency + time * uWaveSpeed) * waveStrength;
    float wave2 = sin(uv.x * uWaveFrequency * 0.7 + time * uWaveSpeed * 0.8) * waveStrength * 0.5;

    vec2 distortedUv = uv;
    distortedUv.x += wave1;
    distortedUv.y += wave2;

    if (uMouseActive > 0.01) {
      vec2 mousePos = uMouse;
      float dist = distance(uv, mousePos);
      float mouseInfluence = smoothstep(uMouseRadius, 0.0, dist);

      float rippleFreq = uWaveFrequency * 5.0;
      float rippleSpeed = uWaveSpeed * 1.0;
      float rippleStrength = uWaveAmplitude * 0.05;

      float ripple = sin(dist * rippleFreq - time * rippleSpeed) * rippleStrength * mouseInfluence * uMouseActive;
      distortedUv.x += ripple;
      distortedUv.y += ripple;
    }

    vec4 color = texture2D(uTexture, distortedUv);

    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec2 pixelCoord = floor(gl_FragCoord.xy / uPixelSize);
    float dither = bayer4x4(pixelCoord);

    float quantized;
    float adjusted = gray + (dither - 0.5) * 0.5;
    if (adjusted < 0.33) {
      quantized = 0.0;
    } else if (adjusted < 0.66) {
      quantized = 0.5;
    } else {
      quantized = 1.0;
    }

    vec3 bwColor = vec3(quantized);

    float revealDist = distance(uv, uMouse);
    float innerRadius = uRevealRadius * (1.0 - uRevealSoftness);
    float outerRadius = uRevealRadius;
    float revealAmount = 1.0 - smoothstep(innerRadius, outerRadius, revealDist);
    revealAmount *= uMouseActive;

    vec3 finalColor = mix(bwColor, color.rgb, revealAmount);
    gl_FragColor = vec4(finalColor, color.a);
  }
`

interface ImagePlaneProps {
  src: string
  aspectRatio: number
  pointerPosition: { x: number; y: number }
  revealRadius: number
  revealSoftness: number
  pixelSize: number
  waveSpeed: number
  waveFrequency: number
  waveAmplitude: number
  mouseRadius: number
  isMouseInCanvas: boolean
}

function ImagePlane({
  src,
  aspectRatio,
  pointerPosition,
  revealRadius,
  revealSoftness,
  pixelSize,
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  mouseRadius,
  isMouseInCanvas,
}: ImagePlaneProps) {
  const texture = useTexture(src)
  const meshRef = useRef<THREE.Mesh>(null)
  const { size, viewport } = useThree()
  const mouseActiveRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uRevealRadius: { value: revealRadius },
      uRevealSoftness: { value: revealSoftness },
      uPixelSize: { value: pixelSize },
      uMouseActive: { value: 0 },
      uWaveSpeed: { value: waveSpeed },
      uWaveFrequency: { value: waveFrequency },
      uWaveAmplitude: { value: waveAmplitude },
      uMouseRadius: { value: mouseRadius },
    }),
    [
      texture,
      revealRadius,
      revealSoftness,
      pixelSize,
      waveSpeed,
      waveFrequency,
      waveAmplitude,
      mouseRadius,
    ]
  )

  const scale = useMemo<[number, number, number]>(() => {
    const containerAspect = size.width / Math.max(size.height, 1)

    if (containerAspect > aspectRatio) {
      return [viewport.width, viewport.width / aspectRatio, 1]
    }

    return [viewport.height * aspectRatio, viewport.height, 1]
  }, [aspectRatio, size.height, size.width, viewport.height, viewport.width])

  useFrame((state) => {
    if (!meshRef.current) {
      return
    }

    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = state.clock.elapsedTime

    const targetActive = isMouseInCanvas ? 1 : 0
    mouseActiveRef.current += (targetActive - mouseActiveRef.current) * 0.08
    material.uniforms.uMouseActive.value = mouseActiveRef.current

    material.uniforms.uMouse.value.set(pointerPosition.x, pointerPosition.y)
  })

  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

interface RevealWaveImageProps {
  src: string
  revealRadius?: number
  revealSoftness?: number
  pixelSize?: number
  waveSpeed?: number
  waveFrequency?: number
  waveAmplitude?: number
  mouseRadius?: number
  className?: string
}

export function RevealWaveImage({
  src,
  revealRadius = 0.2,
  revealSoftness = 0.5,
  pixelSize = 3,
  waveSpeed = 0.5,
  waveFrequency = 3,
  waveAmplitude = 0.2,
  mouseRadius = 0.2,
  className = 'h-full w-full',
}: RevealWaveImageProps) {
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const [pointerPosition, setPointerPosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      setAspectRatio(image.naturalWidth / image.naturalHeight)
    }
  }, [src])

  const updatePointerPosition = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = (clientX - rect.left) / Math.max(rect.width, 1)
    const y = (clientY - rect.top) / Math.max(rect.height, 1)

    setPointerPosition({
      x: Math.min(Math.max(x, 0), 1),
      y: 1 - Math.min(Math.max(y, 0), 1),
    })
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={(event) => {
        setIsMouseInCanvas(true)
        updatePointerPosition(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())
      }}
      onPointerMove={(event) => {
        setIsMouseInCanvas(true)
        updatePointerPosition(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())
      }}
      onPointerLeave={() => setIsMouseInCanvas(false)}
      onTouchStart={(event) => {
        const touch = event.touches[0]
        if (!touch) return
        setIsMouseInCanvas(true)
        updatePointerPosition(touch.clientX, touch.clientY, event.currentTarget.getBoundingClientRect())
      }}
      onTouchMove={(event) => {
        const touch = event.touches[0]
        if (!touch) return
        setIsMouseInCanvas(true)
        updatePointerPosition(touch.clientX, touch.clientY, event.currentTarget.getBoundingClientRect())
      }}
      onTouchEnd={() => setIsMouseInCanvas(false)}
    >
      {aspectRatio !== null ? (
        <Canvas
          style={{ width: '100%', height: '100%', display: 'block' }}
          gl={{ antialias: false }}
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
        >
          <ImagePlane
            src={src}
            aspectRatio={aspectRatio}
            pointerPosition={pointerPosition}
            revealRadius={revealRadius}
            revealSoftness={revealSoftness}
            pixelSize={pixelSize}
            waveSpeed={waveSpeed}
            waveFrequency={waveFrequency}
            waveAmplitude={waveAmplitude}
            mouseRadius={mouseRadius}
            isMouseInCanvas={isMouseInCanvas}
          />
        </Canvas>
      ) : null}
    </div>
  )
}
