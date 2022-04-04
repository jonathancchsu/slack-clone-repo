from flask import Blueprint,render_template, redirect, url_for, request
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db

bp = Blueprint('messages', __name__)

@bp.route('/<int:channel_id>')
def get_one_channel(channel_id):
    channel = Channel.query.get(channel_id)
    messages = Message.query.filter(Message.channel_id == channel_id).all()
    return channel.to_dict()

@bp.route('/channels/<int:channel_id>', methods=['GET', 'POST'])
def channel_messages(channel_id):
    print('before ifssssssssssssssssssssssssssssssss')
    if request.method == 'GET':

        messages = Message.query.filter(Message.channel_id == channel_id).all()
        print('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',messages)

        return {"messages":[message.to_dict() for message in messages]}
    if request.method == 'POST':
        data = request.json
        print('hereeeeeeeeeeeeeeeeeeeeeeeeeee',data)
        message = Message(
            channel_id=data['channel_id'],
            sender_id=data['sender_id'],
            content=data['content']
        )
        db.session.add(message)
        db.session.commit()

        return message.to_dict()

@bp.route('/dm_rooms/<int:dm_room_id>', methods=['GET', 'POST'])
def dm_room_messages(dm_room_id):
    if request.method == 'GET':

        messages = Message.query.filter(Message.room_id == dm_room_id).all()

        return {"messages":[message.to_dict() for message in messages]}
    if request.method == 'POST':
        data = request.json
        message = Message(
            room_id=data['room_id'],
            sender_id=data['sender_id'],
            content=data['content']
        )
        db.session.add(message)
        db.session.commit()

        return message.to_dict()

@bp.route('/messages/<int:message_id>', methods=['PUT', 'DELETE'])
def message(message_id):
    if request.method == 'PUT':
        message =Message.query.get(message_id)
        data = request.json
        message.content = data['content']
        db.session.add(message)
        db.session.commit()
    if request.method == 'DELETE':
        db.session.query(Message).filter(Message.id == message_id).delete()

        db.session.commit()

        return {'message_id': message_id}
