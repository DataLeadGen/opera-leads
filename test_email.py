#!/usr/bin/env python3
"""
Test script to verify SMTP email configuration
"""
import os
import sys
from flask import Flask
from flask_mail import Mail, Message

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Create a minimal Flask app for testing
app = Flask(__name__)

# Configure Flask-Mail for SMTP
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'naeem@operalead.com'
app.config['MAIL_PASSWORD'] = 'asqd bvhx azzr vaaw'
app.config['MAIL_DEFAULT_SENDER'] = 'naeem@operalead.com'

# Initialize Flask-Mail
mail = Mail(app)

def test_email():
    """Test sending an email"""
    with app.app_context():
        try:
            msg = Message(
                subject='Test Email from Opera Leads Contact Form',
                recipients=['naeem@operalead.com'],
                body="""
This is a test email to verify that the SMTP configuration is working correctly.

If you receive this email, the contact form email functionality is properly configured.

Test details:
- SMTP Server: smtp.gmail.com
- Port: 587
- TLS: Enabled
- Username: naeem@operalead.com

Best regards,
Opera Leads System
                """.strip()
            )
            
            mail.send(msg)
            print("SUCCESS: Test email sent successfully!")
            print("INFO: Check naeem@operalead.com for the test email.")
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to send test email: {str(e)}")
            return False

if __name__ == '__main__':
    print("Testing SMTP email configuration...")
    print("Sending test email to naeem@operalead.com...")
    
    success = test_email()
    
    if success:
        print("\nSUCCESS: Email configuration test completed successfully!")
        print("INFO: Your contact form will now send emails when users submit the form.")
    else:
        print("\nERROR: Email configuration test failed!")
        print("INFO: Please check your SMTP settings and credentials.")