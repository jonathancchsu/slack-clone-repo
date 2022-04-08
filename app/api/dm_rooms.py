# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
from app.forms.channel_form import ChannelForm
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db
from flask_login import current_user, login_user, logout_user, login_required
from app.forms.channel_form import ChannelForm

import json

def room_exists(workspace_id, user_ids):
    available_room_ids = db.session.query(DirectMessageRoom.id).filter(DirectMessageRoom.workspace_id == workspace_id)
    available_room_ids = [available_room_id[0] for available_room_id in available_room_ids]
    for available_room_id in available_room_ids:
        users_in_room = db.session.query(DirectMessageMember.user_id).filter(DirectMessageMember.room_id == available_room_id)
        users_in_room = [user_in_room[0] for user_in_room in users_in_room]
        users_in_room.sort()
        users_in_room = "".join([str(user_in_room) for user_in_room in users_in_room])
        if user_ids == users_in_room:
            return available_room_id
    return False

bp = Blueprint('dm_rooms', __name__, url_prefix='dm_rooms')
@bp.route('/', methods=['POST'])
def dm_create():
    data = request.json

    user_ids = [member['id'] for member in data['members']]
    user_ids.sort()
    user_ids = "".join([str(user_id) for user_id in user_ids])

    room_exists_id = room_exists(data['workspace_id'], user_ids)

    if room_exists_id is not False:
        return { 'error': room_exists_id }
    else:
        dm_room = DirectMessageRoom(
                owner_id=data['owner_id'],
                workspace_id=data['workspace_id'],
        )
        db.session.add(dm_room)
        db.session.commit()

        requestMembers = data['members']
        print(requestMembers)
        for member in requestMembers:

            dm_member = DirectMessageMember(
                room_id=dm_room.id,
                user_id=member['id'],
            )
            db.session.add(dm_member)
            db.session.commit()
        user = User.query.get(dm_room.owner_id)

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
