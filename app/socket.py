from flask_socketio import SocketIO, emit
import os

# configure cors_allowed_origins
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://slack-project-clone.herokuapp.com',
        'https://slack-project-clone.herokuapp.com'
    ]
else:
    origins = "*"

# initialize your socket instance
socketio = SocketIO(cors_allowed_origins=origins)

# handle chat messages
@socketio.on("chat")
def handle_chat(data):
    emit("chat", data, broadcast=True)
@socketio.on("channels")
def handle_channels(data):
    emit("channels", data, broadcast=True)
@socketio.on("dm_rooms")
def handle_dm_rooms(data):
    emit("dm_rooms", data, broadcast=True)
