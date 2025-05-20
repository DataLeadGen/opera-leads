import os
import logging
from datetime import datetime

from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix


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
# Initialize the app with the extension
db.init_app(app)

# Import routes after app is created to avoid circular imports
from forms import ContactForm, BookingForm
import models

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/testimonials')
def testimonials():
    return render_template('testimonials.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

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
        
        flash('Your consultation has been scheduled! We will confirm the details shortly.', 'success')
        return redirect(url_for('booking'))
    
    return render_template('booking.html', form=form)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
