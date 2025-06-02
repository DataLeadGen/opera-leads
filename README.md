# Opera Leads Solutions

A modern, SEO-optimized website for Opera Leads, a B2B data solutions provider.

## Features

- **SEO Optimized**: Structured data, meta tags, semantic HTML, and more
- **Modern UI/UX**: Glassmorphism effects, animations, and responsive design
- **Performance First**: Optimized images, caching, and compressed assets
- **Accessibility**: WCAG 2.1 AA compliant with ARIA roles and keyboard navigation
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Mobile-First**: Fully responsive across all devices

## Tech Stack

- **Backend**: Flask, SQLAlchemy, Flask-Caching
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Animation**: AOS, GSAP
- **SEO**: JSON-LD structured data, dynamic meta tags
- **Performance**: Lazy loading, image optimization, Gzip compression

## Getting Started

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/opera-leads-solutions.git
   cd opera-leads-solutions
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed

5. Run the application:
   ```
   python main.py
   ```

6. Visit `http://localhost:5000` in your browser

## Project Structure

- `app.py`: Main Flask application
- `models.py`: Database models
- `forms.py`: Form definitions
- `templates/`: HTML templates
- `static/`: Static assets (CSS, JS, images)
- `instance/`: Instance-specific data (database)

## SEO Features

- Structured data for LocalBusiness, WebPage, and BreadcrumbList
- Dynamic meta tags and Open Graph properties
- Semantic HTML5 elements
- Optimized image loading with srcset and lazy loading
- robots.txt and sitemap.xml
- Canonical URLs

## Performance Optimizations

- Flask-Caching for route caching
- Gzip compression for responses
- Image optimization with lazy loading
- CSS and JS minification
- Modern font loading techniques
- Responsive images with srcset

## Accessibility

- ARIA roles and landmarks
- Keyboard navigation support
- Skip to content link
- Sufficient color contrast
- Focus indicators
- Semantic HTML structure

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [Bootstrap](https://getbootstrap.com/)
- [AOS](https://michalsnik.github.io/aos/)
- [GSAP](https://greensock.com/gsap/)
- [Font Awesome](https://fontawesome.com/)