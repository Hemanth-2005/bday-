/**
 * ScrollController.js
 * Manages GSAP ScrollTrigger integration for scroll-driven animations
 */

export class ScrollController {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.trigger = null;
        this.isActive = false;
    }
    
    /**
     * Initialize scroll-based animation
     */
    init() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Create proxy object for animation
        const animationProxy = { progress: 0 };
        
        // Create scroll-triggered timeline
        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#scroll-spacer',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,              // Smooth scrub with 1.5s lag
                pin: false,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Update particle system progress
                    this.particleSystem.setProgress(self.progress);
                    
                    // Update UI overlay opacity
                    this.updateUI(self.progress);
                },
                onEnter: () => {
                    this.isActive = true;
                },
                onLeave: () => {
                    this.isActive = false;
                },
                onEnterBack: () => {
                    this.isActive = true;
                },
                onLeaveBack: () => {
                    this.isActive = false;
                }
            }
        });
        
        // Animate proxy object
        this.timeline.to(animationProxy, {
            progress: 1,
            ease: 'none',
            onUpdate: () => {
                // Additional per-frame updates if needed
            }
        });
        
        // Store trigger reference for cleanup
        this.trigger = this.timeline.scrollTrigger;
        
        return this;
    }
    
    /**
     * Update UI based on scroll progress
     */
    updateUI(progress) {
        const overlay = document.getElementById('ui-overlay');
        if (!overlay) return;
        
        // Fade out UI as user scrolls
        const opacity = Math.max(0, 1 - progress * 2);
        overlay.style.opacity = opacity;
        
        // Add/remove hidden class
        if (progress > 0.5) {
            overlay.classList.add('hidden');
        } else {
            overlay.classList.remove('hidden');
        }
    }
    
    /**
     * Set progress manually (for testing or external control)
     */
    setProgress(value) {
        if (this.trigger) {
            this.trigger.scroll(value * this.trigger.end);
        }
    }
    
    /**
     * Get current scroll progress (0-1)
     */
    getProgress() {
        return this.trigger ? this.trigger.progress : 0;
    }
    
    /**
     * Refresh ScrollTrigger calculations
     * Call after DOM changes or resize
     */
    refresh() {
        ScrollTrigger.refresh();
    }
    
    /**
     * Clean up ScrollTrigger instances
     */
    dispose() {
        if (this.trigger) {
            this.trigger.kill();
        }
        if (this.timeline) {
            this.timeline.kill();
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}
