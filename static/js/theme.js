/**
 * Theme Toggle Functionality
 * Handles dark/light mode switching with localStorage persistence
 */
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDarkScheme.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
    
    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Trigger a custom event that other scripts can listen for
            document.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: newTheme } 
            }));
        });
    }
    
    // Update theme icon based on current theme
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
            themeToggle.setAttribute('title', 'Switch to light mode');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            themeToggle.setAttribute('title', 'Switch to dark mode');
        }
    }
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', function(e) {
        // Only change theme if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
    
    // Add keyboard support for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('keydown', function(e) {
            // Toggle on Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }
});