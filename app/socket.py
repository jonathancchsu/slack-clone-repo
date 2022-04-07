from flask_socketio import SocketIO, emit, join_room, leave_room
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

@socketio.on('join')
def on_join(data):
        join_room(data['room'])

# handle leave char
@socketio.on("leave")
def on_leave(data):
    leave_room(data['room'])
