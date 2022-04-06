from flask import Blueprint, jsonify, session, request
from app.models import User, db
from app.forms import LoginForm
from flask_login import current_user, login_user, logout_user, login_required
from app.aws import upload_file_to_s3, allowed_file, get_unique_filename

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """

    errors = []
    email = User.query.filter(User.email == request.form['email']).first()
    username = User.query.filter(User.username == request.form['username']).first()
    password = request.form['password']
    repeat_password = request.form['repeat_password']


    if email:
        errors.append('Email address is already in use.')
    if username:
        errors.append('Username is already in use.')
    if password != repeat_password:
        errors.append('Passwords do not match.')
    if len(errors):
        return {'errors': errors}, 401

    url = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

    if "profile_picture" in request.files:
        image = request.files["profile_picture"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        url = upload["url"]

    user = User(
        username=request.form['username'],
        email=request.form['email'],
        profile_picture=url,
        password=request.form['password'],
    )
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return user.to_dict()


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
