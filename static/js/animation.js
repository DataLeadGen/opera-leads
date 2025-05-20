document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Hero typing effect
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const text = heroTagline.textContent;
        heroTagline.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Service card hover animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.service-icon').classList.add('bounce');
            setTimeout(() => {
                this.querySelector('.service-icon').classList.remove('bounce');
            }, 1000);
        });
    });
    
    // Data visualization animation
    const dataVisual = document.querySelector('.data-visual-animation');
    if (dataVisual) {
        // Simple bar chart animation
        const bars = dataVisual.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                const height = bar.getAttribute('data-height');
                bar.style.height = height + '%';
            }, index * 200);
        });
    }
    
    // Animate numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    const numberElements = document.querySelectorAll('.animate-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = parseInt(element.getAttribute('data-value'));
                animateValue(element, 0, finalValue, 2000);
                numberObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    numberElements.forEach(element => {
        numberObserver.observe(element);
    });
    
    // Parallax effect
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Circular progress bars
    const circleProgress = document.querySelectorAll('.circle-progress');
    if (circleProgress.length > 0) {
        circleProgress.forEach(progress => {
            const value = progress.getAttribute('data-value');
            const circle = progress.querySelector('circle');
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            function setProgress(percent) {
                const offset = circumference - percent / 100 * circumference;
                circle.style.strokeDashoffset = offset;
            }
            
            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setProgress(value);
                        }, 300);
                        progressObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            progressObserver.observe(progress);
        });
    }
});
