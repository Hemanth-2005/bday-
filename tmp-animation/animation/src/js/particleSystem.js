/**
 * ParticleSystem.js
 * Handles Three.js particle creation, image processing, and rendering
 */

export class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.material = null;
        this.geometry = null;
        
        // Configuration - ABSOLUTE MAXIMUM for photo-realistic density
        this.config = {
            particleCount: 300000,     // 300k particles maximum
            sampleStep: 1,             // Sample EVERY pixel (no skipping)
            scatterRange: 800,         // Random scatter range
            scatterDepth: 400,         // Z-depth for scattered particles
            imageUrl: null             // Will be set to a default or provided image
        };
        
        // State
        this.width = 0;
        this.height = 0;
        this.aspectRatio = 1;
        this.isInitialized = false;
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
    }
    
    /**
     * Initialize the Three.js scene
     */
    async init(imageUrl) {
        this.config.imageUrl = imageUrl || this.getDefaultImage();
        
        // Setup scene
        this.setupScene();
        
        // Setup camera
        this.setupCamera();
        
        // Setup renderer
        this.setupRenderer();
        
        // Load and process image
        const imageData = await this.loadImage(this.config.imageUrl);
        
        // Create particle system from image
        this.createParticles(imageData);
        
        // Add resize listener
        window.addEventListener('resize', this.handleResize);
        
        // Start animation loop
        this.isInitialized = true;
        this.animate();
        
        return this;
    }
    
    /**
     * Create a default gradient image for demonstration
     */
    getDefaultImage() {
        // Create a canvas with a nice gradient pattern
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Add some shapes
        ctx.fillStyle = '#e94560';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            const r = 20 + Math.random() * 60;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PARTICLES', 400, 250);
        ctx.font = '40px Arial';
        ctx.fillText('SCROLL TO REVEAL', 400, 350);
        
        return canvas.toDataURL();
    }
    
    /**
     * Setup Three.js scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);
    }
    
    /**
     * Setup orthographic camera for pixel-perfect rendering
     */
    setupCamera() {
        const frustumSize = 1000;
        this.aspectRatio = this.container.clientWidth / this.container.clientHeight;
        
        this.camera = new THREE.OrthographicCamera(
            frustumSize * this.aspectRatio / -2,
            frustumSize * this.aspectRatio / 2,
            frustumSize / 2,
            frustumSize / -2,
            1,
            2000
        );
        
        this.camera.position.z = 500;
    }
    
    /**
     * Setup WebGL renderer with performance optimizations
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,           // Disable for performance
            alpha: false,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x050505, 1);
        
        // Performance optimizations
        this.renderer.sortObjects = false;
        this.renderer.depthTest = false;
        this.renderer.depthWrite = false;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    /**
     * Load and process image
     */
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // Create hidden canvas for pixel extraction
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                
                // Maximum resolution source
                const maxDim = 1000;
                let width = img.width;
                let height = img.height;
                
                if (width > maxDim || height > maxDim) {
                    const scale = maxDim / Math.max(width, height);
                    width = Math.floor(width * scale);
                    height = Math.floor(height * scale);
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and get pixel data
                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                
                resolve({
                    data: imageData.data,
                    width: width,
                    height: height
                });
            };
            
            img.onerror = reject;
            img.src = url;
        });
    }
    
    /**
     * Create particle system from image data
     */
    createParticles(imageData) {
        const { data, width, height } = imageData;
        this.width = width;
        this.height = height;
        
        // Sample pixels based on step size
        const step = this.config.sampleStep;
        const sampledPixels = [];
        
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                
                // Capture ALL pixels for maximum density (skip only fully transparent)
                if (a > 10) {
                    sampledPixels.push({
                        x: x - width / 2,
                        y: -(y - height / 2), // Flip Y for Three.js
                        r: r / 255,
                        g: g / 255,
                        b: b / 255
                    });
                }
            }
        }
        
        // Limit particle count
        let finalPixels = sampledPixels;
        if (sampledPixels.length > this.config.particleCount) {
            // Random shuffle and take first N
            for (let i = sampledPixels.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sampledPixels[i], sampledPixels[j]] = [sampledPixels[j], sampledPixels[i]];
            }
            finalPixels = sampledPixels.slice(0, this.config.particleCount);
        }
        
        this.createParticleGeometry(finalPixels);
    }
    
    /**
     * Create BufferGeometry with particle attributes
     */
    createParticleGeometry(pixels) {
        const count = pixels.length;
        
        // Create buffer attributes
        const positions = new Float32Array(count * 3);
        const targetPositions = new Float32Array(count * 3);
        const startPositions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const randomOffsets = new Float32Array(count);
        const sizes = new Float32Array(count);
        
        const scatterRange = this.config.scatterRange;
        const scatterDepth = this.config.scatterDepth;
        
        for (let i = 0; i < count; i++) {
            const pixel = pixels[i];
            const i3 = i * 3;
            
            // Target position (where particle forms the image)
            targetPositions[i3] = pixel.x * 2;     // Scale up for visibility
            targetPositions[i3 + 1] = pixel.y * 2;
            targetPositions[i3 + 2] = 0;
            
            // Random start position (scattered in 3D space)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = scatterRange * (0.5 + Math.random() * 0.5);
            
            startPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
            startPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            startPositions[i3 + 2] = (Math.random() - 0.5) * scatterDepth * 2;
            
            // Current position starts at scattered position
            positions[i3] = startPositions[i3];
            positions[i3 + 1] = startPositions[i3 + 1];
            positions[i3 + 2] = startPositions[i3 + 2];
            
            // Color
            colors[i3] = pixel.r;
            colors[i3 + 1] = pixel.g;
            colors[i3 + 2] = pixel.b;
            
            // Random offset for animation timing
            randomOffsets[i] = Math.random();
            
            // Maximum size particles for COMPLETE gap coverage
            sizes[i] = 3.5 + Math.random() * 2.5;
        }
        
        // Create geometry
        this.geometry = new THREE.BufferGeometry();
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
        this.geometry.setAttribute('startPosition', new THREE.BufferAttribute(startPositions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create shader material
        this.material = this.createShaderMaterial();
        
        // Create particle system
        this.particles = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particles);
    }
    
    /**
     * Create custom shader material
     */
    createShaderMaterial() {
        // Load shader source
        const vertexShader = this.getVertexShader();
        const fragmentShader = this.getFragmentShader();
        
        return new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 0.0 },
                uTime: { value: 0.0 },
                uPixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
    }
    
    /**
     * Get vertex shader source
     */
    getVertexShader() {
        return `
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
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                
                vec3 i  = floor(v + dot(v, C.yyy));
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
                
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            float customEase(float t) {
                float easeOut = 1.0 - pow(1.0 - t, 3.0);
                float overshoot = sin(t * 3.14159) * 0.05 * (1.0 - t);
                return easeOut + overshoot;
            }
            
            void main() {
                float delay = randomOffset * 0.15;
                float adjustedProgress = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
                
                float easedProgress = customEase(adjustedProgress);
                
                float noiseScale = 0.5 * (1.0 - adjustedProgress);
                vec3 noisePos = position * 0.1 + uTime * 0.2;
                vec3 noiseOffset = vec3(
                    snoise(noisePos),
                    snoise(noisePos + 100.0),
                    snoise(noisePos + 200.0)
                ) * noiseScale * (1.0 - adjustedProgress);
                
                vec3 currentPosition = mix(startPosition, targetPosition, easedProgress);
                currentPosition += noiseOffset;
                
                float zDepth = sin(adjustedProgress * 3.14159) * 50.0 * randomOffset;
                currentPosition.z += zDepth * (1.0 - adjustedProgress);
                
                vec4 mvPosition = modelViewMatrix * vec4(currentPosition, 1.0);
                
                float perspectiveScale = 300.0 / -mvPosition.z;
                gl_PointSize = size * perspectiveScale * uPixelRatio;
                
                gl_Position = projectionMatrix * mvPosition;
                
                vColor = color;
                vAlpha = 0.3 + 0.7 * adjustedProgress;
            }
        `;
    }
    
    /**
     * Get fragment shader source
     */
    getFragmentShader() {
        return `
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uProgress;
            
            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Maximum softness for complete gapless photo-realistic blending
                float radius = 0.5;
                float softness = 0.35;
                float circle = 1.0 - smoothstep(0.0, radius + softness, dist);
                
                // Maximum glow for seamless overlap
                float glow = 1.0 - smoothstep(0.0, 0.7, dist);
                glow = pow(glow, 1.2);
                
                float alpha = circle * vAlpha;
                
                // Maximum glow intensity for photo-realistic blending
                float glowIntensity = 1.0 + uProgress * 0.5;
                vec3 finalColor = vColor + (vColor * glow * 1.0 * glowIntensity);
                finalColor *= 1.5;
                
                gl_FragColor = vec4(finalColor * alpha, alpha);
            }
        `;
    }
    
    /**
     * Update animation progress (0 to 1)
     */
    setProgress(progress) {
        if (this.material) {
            this.material.uniforms.uProgress.value = Math.max(0, Math.min(1, progress));
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.aspectRatio = width / height;
        
        // Update camera
        const frustumSize = 1000;
        this.camera.left = frustumSize * this.aspectRatio / -2;
        this.camera.right = frustumSize * this.aspectRatio / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Update shader uniform
        if (this.material) {
            this.material.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
        }
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.isInitialized) return;
        
        requestAnimationFrame(this.animate);
        
        // Update time uniform for noise animation
        if (this.material) {
            this.material.uniforms.uTime.value = performance.now() * 0.001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        window.removeEventListener('resize', this.handleResize);
        
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        if (this.renderer) this.renderer.dispose();
        
        this.isInitialized = false;
    }
}
