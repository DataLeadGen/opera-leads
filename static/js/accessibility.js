/**
 * Accessibility Enhancements
 * Improves website accessibility with keyboard navigation, focus management, and more
 */
document.addEventListener('DOMContentLoaded', function() {
    // Track if user is using keyboard navigation
    let usingKeyboard = false;
    
    // Detect keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            usingKeyboard = true;
            document.body.classList.add('keyboard-nav');
            
            // Create keyboard focus indicator if it doesn't exist
            if (!document.querySelector('.keyboard-focus-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'keyboard-focus-indicator';
                document.body.appendChild(indicator);
            }
        }
    });
    
    // Detect mouse use
    document.addEventListener('mousedown', function() {
        usingKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });
    
    // Enhanced focus indicator for keyboard users
    document.addEventListener('focusin', function(e) {
        if (usingKeyboard && document.querySelector('.keyboard-focus-indicator')) {
            const target = e.target;
            const indicator = document.querySelector('.keyboard-focus-indicator');
            
            // Get position and dimensions of focused element
            const rect = target.getBoundingClientRect();
            
            // Position the indicator
            indicator.style.display = 'block';
            indicator.style.top = rect.top + window.scrollY + 'px';
            indicator.style.left = rect.left + window.scrollX + 'px';
            indicator.style.width = rect.width + 'px';
            indicator.style.height = rect.height + 'px';
        }
    });
    
    document.addEventListener('focusout', function() {
        const indicator = document.querySelector('.keyboard-focus-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    });
    
    // Add aria-current to active navigation items
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === currentPath) {
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Ensure all interactive elements have accessible names
    document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
        if (!element.hasAttribute('aria-label') && 
            !element.hasAttribute('aria-labelledby') && 
            !element.innerText && 
            element.tagName !== 'INPUT' && 
            element.tagName !== 'TEXTAREA') {
            
            // Try to find an icon and use its class as a label
            const icon = element.querySelector('i[class*="fa-"]');
            if (icon) {
                const iconClass = Array.from(icon.classList)
                    .find(cls => cls.startsWith('fa-'))
                    ?.replace('fa-', '')
                    ?.replace('-', ' ');
                
                if (iconClass) {
                    element.setAttribute('aria-label', iconClass);
                }
            }
        }
    });
    
    // Make sure all form elements have labels
    document.querySelectorAll('input, select, textarea').forEach(formElement => {
        const id = formElement.id;
        if (id && !document.querySelector(`label[for="${id}"]`)) {
            // If there's a placeholder, use it to create a visually hidden label
            if (formElement.placeholder) {
                const label = document.createElement('label');
                label.setAttribute('for', id);
                label.classList.add('sr-only');
                label.textContent = formElement.placeholder;
                formElement.parentNode.insertBefore(label, formElement);
            }
        }
    });
    
    // Add role="button" to elements that look like buttons but aren't
    document.querySelectorAll('.btn, [class*="btn-"]').forEach(element => {
        if (element.tagName !== 'BUTTON' && element.tagName !== 'INPUT') {
            element.setAttribute('role', 'button');
            
            // Add keyboard support
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event listeners
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        }
    });
    
    // Ensure proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        
        // If heading skips a level, log a warning
        if (level - previousLevel > 1 && previousLevel !== 0) {
            console.warn('Accessibility warning: Heading level skipped from', 
                         'h' + previousLevel, 'to', heading.tagName, 
                         'at:', heading.textContent);
        }
        
        previousLevel = level;
    });
    
    // Add lang attribute to foreign language text
    document.querySelectorAll('[data-lang]').forEach(element => {
        element.setAttribute('lang', element.dataset.lang);
    });
    
    // Ensure all iframes have titles
    document.querySelectorAll('iframe').forEach(iframe => {
        if (!iframe.hasAttribute('title')) {
            iframe.setAttribute('title', 'Embedded content');
        }
    });
});