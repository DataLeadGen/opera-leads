/**
 * Site Search Functionality
 * Provides client-side search capabilities for the website
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get search form and input elements
    const searchForm = document.getElementById('site-search-form');
    const searchInput = document.getElementById('site-search-input');
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    // Search index - this would ideally be generated server-side
    // For now, we'll use a simple static index
    const searchIndex = [
        {
            title: 'Home',
            description: 'Opera Leads - Leading provider of B2B data solutions',
            url: '/',
            keywords: ['home', 'opera leads', 'b2b', 'data solutions', 'lead generation']
        },
        {
            title: 'About Us',
            description: 'Learn about Opera Leads and our mission to provide accurate B2B data',
            url: '/about',
            keywords: ['about', 'company', 'mission', 'vision', 'team', 'history']
        },
        {
            title: 'Services',
            description: 'Explore our comprehensive B2B data services',
            url: '/services',
            keywords: ['services', 'data mining', 'email list', 'contact list', 'data cleansing', 'crm']
        },
        {
            title: 'Data Mining Services',
            description: 'Extract valuable insights from raw data with our data mining services',
            url: '/services#data-mining',
            keywords: ['data mining', 'data extraction', 'insights', 'analytics']
        },
        {
            title: 'Email List Building',
            description: 'Build targeted email lists for your marketing campaigns',
            url: '/services#email-list',
            keywords: ['email list', 'email marketing', 'targeted emails', 'lead generation']
        },
        {
            title: 'Contact List Building',
            description: 'Create comprehensive contact lists with accurate information',
            url: '/services#contact-list',
            keywords: ['contact list', 'phone numbers', 'addresses', 'business contacts']
        },
        {
            title: 'Data Cleansing',
            description: 'Clean and validate your existing data for better results',
            url: '/services#data-cleansing',
            keywords: ['data cleansing', 'data cleaning', 'validation', 'verification']
        },
        {
            title: 'CRM Data Management',
            description: 'Optimize your CRM with clean, accurate, and up-to-date data',
            url: '/services#crm',
            keywords: ['crm', 'customer relationship management', 'data management']
        },
        {
            title: 'Testimonials',
            description: 'See what our clients say about our B2B data solutions',
            url: '/testimonials',
            keywords: ['testimonials', 'reviews', 'client feedback', 'success stories']
        },
        {
            title: 'FAQ',
            description: 'Frequently asked questions about our B2B data services',
            url: '/faq',
            keywords: ['faq', 'questions', 'answers', 'help', 'support']
        },
        {
            title: 'Sample Leads',
            description: 'View sample B2B leads to see the quality of our data',
            url: '/sample-leads',
            keywords: ['sample leads', 'examples', 'data quality', 'preview']
        },
        {
            title: 'Contact Us',
            description: 'Get in touch with our team for B2B data solutions',
            url: '/contact',
            keywords: ['contact', 'get in touch', 'support', 'help', 'inquiry']
        },
        {
            title: 'Book a Consultation',
            description: 'Schedule a free consultation to discuss your B2B data needs',
            url: '/booking',
            keywords: ['booking', 'consultation', 'appointment', 'schedule', 'free sample']
        }
    ];
    
    // Function to perform search
    function performSearch(query) {
        // Normalize query
        query = query.toLowerCase().trim();
        
        if (query.length < 2) {
            return [];
        }
        
        // Search through index
        return searchIndex.filter(item => {
            // Check title
            if (item.title.toLowerCase().includes(query)) {
                return true;
            }
            
            // Check description
            if (item.description.toLowerCase().includes(query)) {
                return true;
            }
            
            // Check keywords
            return item.keywords.some(keyword => 
                keyword.toLowerCase().includes(query)
            );
        });
    }
    
    // Function to display search results
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        // Clear previous results
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No results found. Try different keywords or browse our services.</p>
                    <div class="mt-3">
                        <a href="/services" class="btn btn-sm btn-outline-primary">View Services</a>
                        <a href="/contact" class="btn btn-sm btn-outline-secondary ms-2">Contact Us</a>
                    </div>
                </div>
            `;
            return;
        }
        
        // Create results list
        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        
        results.forEach(result => {
            const resultItem = document.createElement('li');
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <a href="${result.url}" class="search-result-link">
                    <h4 class="search-result-title">${result.title}</h4>
                    <p class="search-result-description">${result.description}</p>
                </a>
            `;
            
            resultsList.appendChild(resultItem);
        });
        
        searchResults.appendChild(resultsList);
    }
    
    // Handle search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const query = searchInput.value;
            const results = performSearch(query);
            
            displaySearchResults(results);
            
            // Show search overlay
            if (searchOverlay) {
                searchOverlay.classList.add('active');
            }
        });
    }
    
    // Handle search input changes for live search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = searchInput.value;
            
            if (query.length >= 2) {
                const results = performSearch(query);
                displaySearchResults(results);
                
                // Show search overlay
                if (searchOverlay) {
                    searchOverlay.classList.add('active');
                }
            } else {
                // Hide search overlay when query is too short
                if (searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            }
        });
    }
    
    // Close search overlay when clicking outside
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
        
        // Close button
        const closeButton = searchOverlay.querySelector('.close-search');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
            });
        }
    }
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press '/' to focus search
        if (e.key === '/' && searchInput && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Press Escape to close search overlay
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
});