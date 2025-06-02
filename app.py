import os
import logging
from datetime import datetime

from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, make_response, after_this_request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_caching import Cache
from flask_mail import Mail, Message
import gzip
from io import BytesIO
from functools import wraps
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Configure the database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///opera_leads.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Configure Flask-Mail for SMTP
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'naeem@operalead.com'
app.config['MAIL_PASSWORD'] = 'asqd bvhx azzr vaaw'
app.config['MAIL_DEFAULT_SENDER'] = 'naeem@operalead.com'

# Configure Flask-Caching
cache = Cache(app, config={
    'CACHE_TYPE': 'SimpleCache',
    'CACHE_DEFAULT_TIMEOUT': 300
})

# Initialize Flask-Mail
mail = Mail(app)

# Gzip compression for responses
def gzipped(f):
    @wraps(f)
    def view_func(*args, **kwargs):
        @after_this_request
        def zipper(response):
            accept_encoding = request.headers.get('Accept-Encoding', '')
            
            if 'gzip' not in accept_encoding.lower():
                return response
            
            response.direct_passthrough = False
            
            if (response.status_code < 200 or
                response.status_code >= 300 or
                'Content-Encoding' in response.headers):
                return response
            
            gzip_buffer = BytesIO()
            gzip_file = gzip.GzipFile(mode='wb', fileobj=gzip_buffer)
            gzip_file.write(response.data)
            gzip_file.close()
            
            response.data = gzip_buffer.getvalue()
            response.headers['Content-Encoding'] = 'gzip'
            response.headers['Content-Length'] = len(response.data)
            
            return response
        return f(*args, **kwargs)
    return view_func

# Initialize the app with the extension
db.init_app(app)

# Import routes after app is created to avoid circular imports
from forms import ContactForm, BookingForm
import models

# Context processor to add variables to all templates
@app.context_processor
def inject_now():
    return {'now': datetime.now()}

with app.app_context():
    db.create_all()

@app.route('/')
@cache.cached(timeout=3600)  # Cache for 1 hour
@gzipped
def index():
    return render_template('index.html')

@app.route('/about')
@cache.cached(timeout=3600)  # Cache for 1 hour
@gzipped
def about():
    return render_template('about.html')

@app.route('/services')
@cache.cached(timeout=3600)  # Cache for 1 hour
@gzipped
def services():
    return render_template('services.html')

@app.route('/testimonials')
@cache.cached(timeout=3600)  # Cache for 1 hour
@gzipped
def testimonials():
    return render_template('testimonials.html')

@app.route('/faq')
@cache.cached(timeout=3600)  # Cache for 1 hour
@gzipped
def faq():
    return render_template('faq.html')

@app.route('/sample-leads')
@cache.cached(timeout=3600)  # Cache for 1 hour
@gzipped
def sample_leads():
    return render_template('sample_leads.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    form = ContactForm()
    if request.method == 'POST' and form.validate_on_submit():
        # Save the contact submission to the database
        new_contact = models.Contact(
            name=form.name.data,
            email=form.email.data,
            phone=form.phone.data,
            company=form.company.data,
            message=form.message.data,
            created_at=datetime.utcnow()
        )
        db.session.add(new_contact)
        db.session.commit()
        
        # Send email notification
        try:
            # Email to admin
            admin_msg = Message(
                subject=f'New Contact Form Submission from {form.name.data}',
                recipients=['naeem@operalead.com'],
                body=f"""
New contact form submission received:

Name: {form.name.data}
Email: {form.email.data}
Phone: {form.phone.data or 'Not provided'}
Company: {form.company.data or 'Not provided'}

Message:
{form.message.data}

Submitted at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
                """.strip()
            )
            mail.send(admin_msg)
            
            # Confirmation email to user
            user_msg = Message(
                subject='Thank you for contacting Opera Leads',
                recipients=[form.email.data],
                body=f"""
Dear {form.name.data},

Thank you for contacting Opera Leads! We have received your message and will get back to you within 24 hours.

Your message:
{form.message.data}

Best regards,
Opera Leads Team
naeem@operalead.com
+91 7869874458

---
This is an automated confirmation email. Please do not reply to this email.
                """.strip()
            )
            mail.send(user_msg)
            
            flash('Thank you for your message! We will get back to you soon. A confirmation email has been sent to your email address.', 'success')
        except Exception as e:
            app.logger.error(f'Failed to send email: {str(e)}')
            flash('Thank you for your message! We will get back to you soon.', 'success')
        
        return redirect(url_for('contact'))
    
    return render_template('contact.html', form=form)

@app.route('/booking', methods=['GET', 'POST'])
def booking():
    form = BookingForm()
    if request.method == 'POST' and form.validate_on_submit():
        # Save the booking to the database
        new_booking = models.Booking(
            name=form.name.data,
            email=form.email.data,
            phone=form.phone.data,
            company=form.company.data,
            preferred_date=form.preferred_date.data,
            preferred_time=form.preferred_time.data,
            message=form.message.data,
            created_at=datetime.utcnow()
        )
        db.session.add(new_booking)
        db.session.commit()
        
        # Send email notification for booking
        try:
            # Email to admin
            admin_msg = Message(
                subject=f'New Consultation Booking from {form.name.data}',
                recipients=['naeem@operalead.com'],
                body=f"""
New consultation booking received:

Name: {form.name.data}
Email: {form.email.data}
Phone: {form.phone.data}
Company: {form.company.data or 'Not provided'}
Preferred Date: {form.preferred_date.data.strftime('%Y-%m-%d')}
Preferred Time: {form.preferred_time.data}

Additional Requirements:
{form.message.data or 'None provided'}

Submitted at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
                """.strip()
            )
            mail.send(admin_msg)
            
            # Confirmation email to user
            user_msg = Message(
                subject='Consultation Booking Confirmation - Opera Leads',
                recipients=[form.email.data],
                body=f"""
Dear {form.name.data},

Thank you for booking a consultation with Opera Leads! We have received your booking request and will confirm the details shortly.

Booking Details:
- Preferred Date: {form.preferred_date.data.strftime('%B %d, %Y')}
- Preferred Time: {form.preferred_time.data}
- Company: {form.company.data or 'Not provided'}

We will contact you within 24 hours to confirm your consultation appointment.

Best regards,
Opera Leads Team
naeem@operalead.com
+91 7869874458

---
This is an automated confirmation email. Please do not reply to this email.
                """.strip()
            )
            mail.send(user_msg)
            
            flash('Your consultation has been scheduled! We will confirm the details shortly. A confirmation email has been sent to your email address.', 'success')
        except Exception as e:
            app.logger.error(f'Failed to send booking email: {str(e)}')
            flash('Your consultation has been scheduled! We will confirm the details shortly.', 'success')
        
        return redirect(url_for('booking'))
    
    return render_template('booking.html', form=form)

@app.route('/test-images')
def test_images():
    return render_template('test_images.html')

@app.route('/sitemap.xml')
@cache.cached(timeout=86400)  # Cache for 24 hours
@gzipped
def sitemap():
    """Generate sitemap.xml dynamically"""
    # Create a dictionary of all routes with their last modified dates
    routes = {
        'index': datetime.now(),
        'about': datetime.now(),
        'services': datetime.now(),
        'testimonials': datetime.now(),
        'faq': datetime.now(),
        'sample_leads': datetime.now(),
        'contact': datetime.now(),
        'booking': datetime.now()
    }
    
    response = make_response(render_template('sitemap.xml', routes=routes, now=datetime.now()))
    response.headers['Content-Type'] = 'application/xml'
    return response

@app.route('/robots.txt')
@cache.cached(timeout=86400)  # Cache for 24 hours
def robots():
    """Serve robots.txt file"""
    return app.send_static_file('robots.txt')

# Apply cache to other static routes

# SEO-friendly error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
