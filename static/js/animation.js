/**
 * Enhanced Animation Effects
 * Provides advanced animations using GSAP, AOS, and custom effects
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false,
        mirror: true,
        offset: 50
    });

    // Animation on scroll with IntersectionObserver
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in, .flip-in, .rotate-in');
    
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
    
    // Hero typing effect with cursor
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const text = heroTagline.textContent;
        heroTagline.innerHTML = '<span class="typing-text"></span><span class="typing-cursor">|</span>';
        const typingText = heroTagline.querySelector('.typing-text');
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Add blinking cursor animation after typing is complete
                const cursor = heroTagline.querySelector('.typing-cursor');
                cursor.classList.add('blink');
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Define animations if not already in CSS
    if (!document.querySelector('#animation-keyframes')) {
        const style = document.createElement('style');
        style.id = 'animation-keyframes';
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                40% {transform: translateY(-20px);}
                60% {transform: translateY(-10px);}
            }
            .bounce {
                animation: bounce 1s ease;
            }
            
            @keyframes float {
                0% {transform: translateY(0px);}
                50% {transform: translateY(-15px);}
                100% {transform: translateY(0px);}
            }
            .float {
                animation: float 3s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0% {transform: scale(1);}
                50% {transform: scale(1.05);}
                100% {transform: scale(1);}
            }
            .pulse {
                animation: pulse 2s ease-in-out infinite;
            }
            
            @keyframes shake {
                0%, 100% {transform: translateX(0);}
                10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);}
                20%, 40%, 60%, 80% {transform: translateX(5px);}
            }
            .shake {
                animation: shake 0.8s ease-in-out;
            }
            
            @keyframes blink {
                0%, 100% {opacity: 1;}
                50% {opacity: 0;}
            }
            .blink {
                animation: blink 1s step-end infinite;
            }
            
            @keyframes rotate {
                from {transform: rotate(0deg);}
                to {transform: rotate(360deg);}
            }
            .rotate {
                animation: rotate 10s linear infinite;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .fadeInUp {
                animation: fadeInUp 0.8s ease forwards;
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .slideInLeft {
                animation: slideInLeft 0.8s ease forwards;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .slideInRight {
                animation: slideInRight 0.8s ease forwards;
            }
            
            @keyframes zoomIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            .zoomIn {
                animation: zoomIn 0.8s ease forwards;
            }
            
            @keyframes flipIn {
                from {
                    opacity: 0;
                    transform: perspective(400px) rotateY(90deg);
                }
                to {
                    opacity: 1;
                    transform: perspective(400px) rotateY(0deg);
                }
            }
            .flipIn {
                animation: flipIn 0.8s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Apply floating animation to specified elements
    document.querySelectorAll('.float-animation').forEach(element => {
        element.classList.add('float');
    });
    
    // Apply pulse animation to specified elements
    document.querySelectorAll('.pulse-animation').forEach(element => {
        element.classList.add('pulse');
    });
    
    // Apply rotate animation to specified elements
    document.querySelectorAll('.rotate-animation').forEach(element => {
        element.classList.add('rotate');
    });
    
    // Enhanced Service card hover animations with 3D effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate the tilt angle (max 10 degrees)
            const maxTilt = 5;
            const tiltX = ((mouseY - cardCenterY) / (cardRect.height / 2)) * maxTilt;
            const tiltY = ((cardCenterX - mouseX) / (cardRect.width / 2)) * maxTilt;
            
            // Apply the tilt effect
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-15px)`;
            
            // Move the overlay based on mouse position for light effect
            const overlay = this.querySelector('.service-overlay');
            if (overlay) {
                overlay.style.background = `radial-gradient(circle at ${mouseX - cardRect.left}px ${mouseY - cardRect.top}px, rgba(99, 119, 238, 0.15) 0%, rgba(255, 255, 255, 0) 70%)`;
            }
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            const overlay = this.querySelector('.service-overlay');
            if (overlay) {
                overlay.style.background = '';
            }
        });
        
        // Bounce effect on icon when entering
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.classList.add('bounce');
                setTimeout(() => {
                    icon.classList.remove('bounce');
                }, 1000);
            }
            
            // Animate list items sequentially
            const listItems = this.querySelectorAll('ul li');
            listItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(5px)';
                    item.style.opacity = '1';
                }, 100 * index);
            });
        });
    });
    
    // Apply similar hover effects to all cards with .hover-card class
    document.querySelectorAll('.hover-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
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
    
    // Animate numbers with comma formatting
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value.toLocaleString();
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
    
    // Enhanced parallax effect with depth
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const direction = element.getAttribute('data-direction') || 'vertical';
            
            if (direction === 'vertical') {
                const yPos = -(scrollPosition * speed);
                element.style.transform = `translateY(${yPos}px)`;
            } else if (direction === 'horizontal') {
                const xPos = -(scrollPosition * speed);
                element.style.transform = `translateX(${xPos}px)`;
            } else if (direction === 'rotate') {
                const rotation = scrollPosition * speed * 0.1;
                element.style.transform = `rotate(${rotation}deg)`;
            } else if (direction === 'scale') {
                const baseScale = 1;
                const scaleChange = scrollPosition * speed * 0.001;
                const newScale = baseScale + scaleChange;
                element.style.transform = `scale(${newScale})`;
            }
        });
    });
    
    // Circular progress bars with animation
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
    
    // Staggered animation for lists and grids
    document.querySelectorAll('.staggered-animation').forEach(container => {
        const items = container.querySelectorAll('.stagger-item');
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('fadeInUp');
                    }, 100 * index);
                });
                observer.unobserve(container);
            }
        }, { threshold: 0.2 });
        
        observer.observe(container);
    });
    
    // Text reveal animation
    document.querySelectorAll('.text-reveal').forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.opacity = '0';
            span.style.transition = `opacity 0.1s ease ${i * 0.05}s`;
            element.appendChild(span);
        }
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const spans = element.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.opacity = '1';
                });
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    // Scroll-triggered section animations
    document.querySelectorAll('section[data-animation]').forEach(section => {
        const animation = section.getAttribute('data-animation');
        const delay = section.getAttribute('data-delay') || 0;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    section.classList.add(animation);
                }, delay);
                observer.unobserve(section);
            }
        }, { threshold: 0.2 });
        
        observer.observe(section);
    });
    
    // Button hover effects
    document.querySelectorAll('.btn-animated').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
    
    // Image hover zoom effect
    document.querySelectorAll('.img-hover-zoom').forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Animated background gradients
    document.querySelectorAll('.animated-gradient').forEach(element => {
        element.style.backgroundSize = '200% 200%';
        element.style.animation = 'gradientAnimation 10s ease infinite';
    });
    
    // Add gradient animation if not in CSS
    if (!document.querySelector('#gradient-animation')) {
        const style = document.createElement('style');
        style.id = 'gradient-animation';
        style.textContent = `
            @keyframes gradientAnimation {
                0% {background-position: 0% 50%;}
                50% {background-position: 100% 50%;}
                100% {background-position: 0% 50%;}
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animated counters with suffix
    document.querySelectorAll('.counter-with-suffix').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = parseInt(counter.getAttribute('data-duration') || 2000);
        const delay = parseInt(counter.getAttribute('data-delay') || 0);
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    let startTime;
                    let currentNumber = 0;
                    
                    function updateNumber(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        currentNumber = Math.floor(progress * target);
                        counter.textContent = currentNumber.toLocaleString() + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            counter.textContent = target.toLocaleString() + suffix;
                        }
                    }
                    
                    requestAnimationFrame(updateNumber);
                }, delay);
                
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
    
    // Animated SVG paths
    document.querySelectorAll('.animated-svg path').forEach(path => {
        const length = path.getTotalLength();
        
        // Set up the starting position
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Animate the path
                path.style.transition = 'stroke-dashoffset 2s ease-in-out';
                path.style.strokeDashoffset = '0';
                observer.unobserve(path.parentElement);
            }
        }, { threshold: 0.5 });
        
        observer.observe(path.parentElement);
    });
});
