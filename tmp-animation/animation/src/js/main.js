/**
 * Main.js
 * Entry point - initializes particle system and scroll controller
 */

import { ParticleSystem } from './particleSystem.js';
import { ScrollController } from './scrollController.js';

// Configuration
const CONFIG = {
    // Default image - will be used until user uploads their own
    imageUrl: null
};

// Global references for reinitialization
let particleSystem = null;
let scrollController = null;
let container = null;

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Show loading state
        showLoading();
        
        // Get container
        container = document.getElementById('canvas-container');
        if (!container) {
            throw new Error('Canvas container not found');
        }
        
        // Initialize with default or configured image
        await initWithImage(CONFIG.imageUrl);
        
        // Setup file upload handlers
        setupFileUpload();
        
        // Hide loading
        hideLoading();
        
    } catch (error) {
        console.error('Failed to initialize particle system:', error);
        showError('Failed to load animation. Please refresh the page.');
    }
});

/**
 * Initialize particle system with an image
 */
async function initWithImage(imageUrl) {
    // Cleanup existing if any
    if (particleSystem) {
        particleSystem.dispose();
        particleSystem = null;
    }
    if (scrollController) {
        scrollController.dispose();
        scrollController = null;
    }
    
    // Remove old canvas
    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();
    
    // Initialize particle system
    particleSystem = new ParticleSystem(container);
    await particleSystem.init(imageUrl);
    
    // Initialize scroll controller
    scrollController = new ScrollController(particleSystem);
    scrollController.init();
    
    // Store references globally
    window.particleSystem = particleSystem;
    window.scrollController = scrollController;
    
    console.log('Particle animation initialized with new image');
}

/**
 * Setup file upload drag and drop
 */
function setupFileUpload() {
    console.log('Setting up file upload...');
    
    const uploadSection = document.getElementById('upload-section');
    const fileInput = document.getElementById('image-upload');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (!fileInput) console.error('File input not found!');
    if (!uploadSection) console.error('Upload section not found!');
    if (!uploadBtn) console.error('Upload button not found!');
    
    if (!fileInput || !uploadSection) return;
    
    // Button click triggers file input
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Button clicked, opening file picker...');
            fileInput.click();
        });
    }
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        console.log('File selected:', e.target.files);
        const file = e.target.files[0];
        if (file) {
            console.log('Processing file:', file.name, file.type);
            handleImageFile(file);
        }
    });
    
    // Drag and drop
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.classList.add('dragover');
    });
    
    uploadSection.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.classList.remove('dragover');
    });
    
    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        console.log('Dropped file:', file ? file.name : 'none');
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });
    
    console.log('File upload setup complete');
}

/**
 * Handle uploaded image file
 */
function handleImageFile(file) {
    showLoading();
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageUrl = e.target.result; // Data URL
        try {
            await initWithImage(imageUrl);
            hideLoading();
            
            // Scroll to top to see the effect from start
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update UI text
            const hint = document.querySelector('.upload-hint');
            if (hint) hint.textContent = 'Photo loaded! Scroll down to see the animation';
            
        } catch (err) {
            console.error('Failed to load image:', err);
            showError('Failed to process image. Try a smaller image.');
        }
    };
    reader.onerror = () => {
        hideLoading();
        showError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
}

/**
 * Show loading indicator
 */
function showLoading() {
    const existing = document.querySelector('.loading');
    if (existing) return;
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading...';
    document.body.appendChild(loading);
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 500);
    }
}

/**
 * Show error message
 */
function showError(message) {
    hideLoading();
    
    const error = document.createElement('div');
    error.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(233, 69, 96, 0.9);
        color: white;
        padding: 2rem;
        border-radius: 8px;
        font-family: sans-serif;
        z-index: 1000;
        text-align: center;
    `;
    error.textContent = message;
    document.body.appendChild(error);
}
