// Fragment Shader for Particle Image Reconstruction
// Renders circular, soft particles with glow effects

// Varyings from vertex shader
varying vec3 vColor;      // Particle color
varying float vAlpha;     // Particle opacity

// Uniforms
uniform float uProgress;  // Scroll progress for glow intensity

void main() {
    // Calculate distance from center of point (0,0 is center, 1,1 is edge)
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Create circular particle with soft edge
    // Smoothstep creates anti-aliased edge
    float radius = 0.5;
    float softness = 0.1;
    float circle = 1.0 - smoothstep(radius - softness, radius, dist);
    
    // Create glow effect
    // Inner bright core + outer soft glow
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.0); // Sharpen glow
    
    // Combine circle and glow
    float alpha = circle * vAlpha;
    
    // Add extra glow as progress increases
    float glowIntensity = 0.5 + uProgress * 0.5;
    vec3 finalColor = vColor + (vColor * glow * 0.5 * glowIntensity);
    
    // Boost brightness slightly
    finalColor *= 1.2;
    
    // Output final color with alpha
    // Premultiplied alpha for better blending
    gl_FragColor = vec4(finalColor * alpha, alpha);
}
