/**
 * Image Optimization Script
 * Handles lazy loading, responsive images, and prevents layout shifts
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if the browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
        // Lazy loading for images
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // If there's a data-srcset attribute, use it
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    // Set the src from data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    // Add loaded class for fade-in effect
                    img.classList.add('loaded');
                    
                    // Remove blur effect if using blur-up technique
                    if (img.classList.contains('blur-up')) {
                        img.classList.add('lazyloaded');
                    }
                    
                    // Stop observing the image after it's loaded
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe each lazy image
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
        
        // Lazy loading for background images
        const lazyBackgrounds = document.querySelectorAll('.lazy-background');
        
        const backgroundObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.dataset.background) {
                        element.style.backgroundImage = `url(${element.dataset.background})`;
                        element.classList.add('loaded');
                        backgroundObserver.unobserve(element);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe each lazy background
        lazyBackgrounds.forEach(function(bg) {
            backgroundObserver.observe(bg);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        // Simple function to load all images immediately
        function loadAllLazyImages() {
            lazyImages.forEach(function(img) {
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.classList.add('loaded');
                
                if (img.classList.contains('blur-up')) {
                    img.classList.add('lazyloaded');
                }
            });
            
            const lazyBackgrounds = document.querySelectorAll('.lazy-background');
            lazyBackgrounds.forEach(function(bg) {
                if (bg.dataset.background) {
                    bg.style.backgroundImage = `url(${bg.dataset.background})`;
                    bg.classList.add('loaded');
                }
            });
        }
        
        // Load all images immediately
        loadAllLazyImages();
    }
    
    // Handle image loading errors
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
            // Add a class to indicate error
            this.classList.add('img-error');
            
            // Set a fallback image or hide the image
            if (this.dataset.fallback) {
                this.src = this.dataset.fallback;
            } else {
                this.style.display = 'none';
            }
        });
    });
});