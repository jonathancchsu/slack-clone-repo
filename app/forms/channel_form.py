from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import Channel

def length(min=-1, max=-1):
    message = 'Must be between %d and %d characters long.' % (min, max)

    def _length(form, field):
        l = field.data and len(field.data) or 0
        if l < min or max != -1 and l > max:
            raise ValidationError(message)

    return _length

def channel_exists(form, field):
    # Checking if user exists
    name = field.data
    channel = Channel.query.filter(Channel.name == name).first()
    if channel:
        raise ValidationError('This Channel name already exists.')



class ChannelForm(FlaskForm):
    name = StringField(
        'name', validators=[DataRequired(), channel_exists, length(max=100)])
    topic = StringField(
        'topic', validators=[DataRequired(), length(max=100)])
    description = StringField(
        'description', validators=[DataRequired(), length(max=255)])
