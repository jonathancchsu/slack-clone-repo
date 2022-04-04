from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import Workspace

def length(min=-1, max=-1):
    message = 'Must be between %d and %d characters long.' % (min, max)

    def _length(form, field):
        l = field.data and len(field.data) or 0
        if l < min or max != -1 and l > max:
            raise ValidationError(message)

    return _length

def workspace_exists(form, field):
    # Checking if user exists
    name = field.data
    workspace = Workspace.query.filter(Workspace.name == name).first()
    if workspace:
        raise ValidationError('This workspace name already exists.')

class WorkspaceForm(FlaskForm):
    name = StringField(
        'name', validators=[DataRequired(), workspace_exists, length(max=100)])
