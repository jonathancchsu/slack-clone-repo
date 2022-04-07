# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
from app.forms.channel_form import ChannelForm
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db
from flask_login import current_user, login_user, logout_user, login_required
from app.forms.channel_form import ChannelForm

import json

bp = Blueprint('dm_rooms', __name__, url_prefix='dm_rooms')
@bp.route('/', methods=['POST'])
def dm_create():
    data = request.json
    # print('hereeeeeeeeeeeeeeeeeeeeee', data)
    dm_room = DirectMessageRoom(
            owner_id=data['owner_id'],
            workspace_id=data['workspace_id'],
        )
    db.session.add(dm_room)
    db.session.commit()

    requestMembers = data['members']
    for member in requestMembers:

        dm_member = DirectMessageMember(
            room_id=dm_room.id,
            user_id=member['id'],
        )
        db.session.add(dm_member)
        db.session.commit()
    user = User.query.get(dm_room.owner_id)
    dm

    return {'dm_room_id': dm_room.id, 'user_id': dm_room.owner_id, 'workspace_id': dm_room.workspace_id, 'neighbors': [member.room.to_dict() for member in user.dm_room_member][-1]}



@bp.route('/<int:dm_room_id>', methods=['GET', 'PUT', 'DELETE'])
def dm(dm_room_id):
    if request.method == 'GET':
        dm_room = DirectMessageRoom.query.get(dm_room_id)
        return dm_room.to_dict()

    if request.method == 'PUT':
        dm_room = DirectMessageRoom.query.get(dm_room_id)
        data = request.json
        dm_room.name = data['name']
        dm_room.topic = data['topic']
        dm_room.description = data['description']
        db.session.commit()
        return dm_room.to_dict()

    if request.method == 'DELETE':
        dm_room = DirectMessageRoom.query.get(dm_room_id)
        db.session.delete(dm_room)
        db.session.commit()
        return {'dm_room_id': dm_room_id}
