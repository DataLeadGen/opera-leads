from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField, SelectField
from wtforms.validators import DataRequired, Email, Length, Optional

class ContactForm(FlaskForm):
    name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    phone = StringField('Phone Number', validators=[Optional(), Length(min=10, max=20)])
    company = StringField('Company Name', validators=[Optional(), Length(max=100)])
    message = TextAreaField('Message', validators=[DataRequired(), Length(min=10, max=1000)])

class BookingForm(FlaskForm):
    name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    phone = StringField('Phone Number', validators=[DataRequired(), Length(min=10, max=20)])
    company = StringField('Company Name', validators=[Optional(), Length(max=100)])
    preferred_date = DateField('Preferred Date', validators=[DataRequired()])
    preferred_time = SelectField(
        'Preferred Time', 
        choices=[
            ('9:00', '9:00 AM'),
            ('9:30', '9:30 AM'),
            ('10:00', '10:00 AM'),
            ('10:30', '10:30 AM'),
            ('11:00', '11:00 AM'),
            ('11:30', '11:30 AM'),
            ('12:00', '12:00 PM'),
            ('12:30', '12:30 PM'),
            ('1:00', '1:00 PM'),
            ('1:30', '1:30 PM'),
            ('2:00', '2:00 PM'),
            ('2:30', '2:30 PM'),
            ('3:00', '3:00 PM'),
            ('3:30', '3:30 PM'),
            ('4:00', '4:00 PM'),
            ('4:30', '4:30 PM'),
            ('5:00', '5:00 PM'),
        ],
        validators=[DataRequired()]
    )
    message = TextAreaField('Specific Requirements', validators=[Optional(), Length(max=500)])
