from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import Workspace


def workspace_exists(form, field):
    # Checking if user exists
    name = field.data
    workspace = Workspace.query.filter(Workspace.name == name).first()
    if workspace:
        raise ValidationError('This workspace name already exists.')


class WorkspaceForm(FlaskForm):
    name = StringField(
        'name', validators=[DataRequired(), workspace_exists])
