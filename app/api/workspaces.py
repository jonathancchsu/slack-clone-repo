# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
from app.forms.channel_form import ChannelForm
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, channel, db, message, workspace
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import WorkspaceForm

import json

bp = Blueprint('workspaces', __name__, url_prefix='workspaces')

@bp.route('/<int:workspace_id>')
def get_one_workspace(workspace_id):
    workspace = Workspace.query.get(workspace_id)
    return workspace.to_dict()

@bp.route('dms/<int:dm_id>')
def get_one_dm_group(dm_id):
    dm_room = DirectMessageRoom.query.get(dm_id)
    return dm_room.to_dict()

@bp.route('members/<int:channel_id>/<int:user_id>', methods=['POST'])
def add_channel_member(channel_id, user_id):
    data = request.json
    member = ChannelMember(
        channel_id = channel_id,
        user_id = user_id,
    )
    db.session.add(member)
    db.session.commit()
    return {'member': member}

@bp.route('/new', methods=['POST'])
def workspace_create():
    data = request.json
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        workspace = Workspace(
            name=form.data['name'],
            owner_id=data['owner_id']
        )
        db.session.add(workspace)
        db.session.commit()

        workspaceMember = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=workspace.owner_id
        )

        db.session.add(workspaceMember)
        db.session.commit()
        channel = Channel(
            workspace_id= workspace.id,
            owner_id=workspace.owner_id,
            name='General',
            topic='A place for everyone to chat',
            description=f'This is a channel for all {workspace.name}\'s necessities'

        )
        db.session.add(channel)
        db.session.commit()

        channel_member = ChannelMember(
            channel_id=channel.id,
            user_id=channel.owner_id
        )
        db.session.add(channel_member)
        db.session.commit()

        message= Message(
            channel_id=channel.id,
            sender_id=1,
            content=f'Welcome to {workspace.name}!!!'
        )
        db.session.add(message)
        db.session.commit()

        return workspace.to_dict()


@bp.route('/<int:workspace_id>', methods=['PUT','DELETE'])
def workspace_edit_delete(workspace_id):
    if request.method == 'PUT':
        workspace = Workspace.query.get(workspace_id)
        data = request.json

        workspace.name = data['name']
        db.session.commit()
        return workspace.to_dict()
    if request.method == 'DELETE':
        workspace = db.session.query(Workspace).filter(Workspace.id == workspace_id).first()
        db.session.delete(workspace)
        db.session.commit()
        return {'workspace_id': workspace_id}

@bp.route('/users/<int:workspace_id>/<int:user_id>', methods=['POST'])
def add_workspace_member(workspace_id, user_id):
    workspace = Workspace.query.get(workspace_id)
    channels = workspace.channels
    general_id = None
    for channel in channels:
        if channel.name == 'General':
            general_id = channel.id
    user = User.query.get(user_id)
    member = WorkspaceMember(
        workspace_id = workspace_id,
        user_id = user_id,
    )
    db.session.add(member)
    db.session.commit()
    channel_member = ChannelMember(
        channel_id=general_id,
        user_id=user_id
    )
    db.session.add(channel_member)
    db.session.commit()
    return { "id": member.id, "user_id": user_id, "username": user.username, "workspace_id": workspace_id }

@bp.route('/<int:workspace_id>/search/<string:parameters>/<string:keyword>')
def search(workspace_id, parameters, keyword):
    available_channels = db.session.query(Channel).filter(Channel.workspace_id == workspace_id)
    available_rooms = db.session.query(DirectMessageRoom).filter(DirectMessageRoom.workspace_id == workspace_id)

    my_user = User.query.get(current_user.id)

    channel_ids = []
    room_ids = []

    for available_channel in available_channels:
        if my_user.in_channel(available_channel.id):
            channel_ids.append(available_channel.id)
    for available_room in available_rooms:
        if my_user.in_dm_room(available_room.id):
            room_ids.append(available_room.id)

    channels = []
    people = []
    messages=[]
    many = []
    result = []

    if "channels" in parameters:
        channels = db.session.query(Channel).filter(Channel.name.ilike(f"%{keyword}%"), Channel.workspace_id == workspace_id)
        result = result + [channel.to_dict() for channel in channels]
    if "people" in parameters:
        people = db.session.query(User).filter(User.username.ilike(f"%{keyword}%"))
        result = result + [user.to_dict() for user in people if user.in_workspace(workspace_id)]
    if "messages" in parameters:
        messages = db.session.query(Message).filter(Message.content.ilike(f"%{keyword}%"))
        result = result + [message.to_dict() for message in messages if message.channel_id in channel_ids or message.room_id in room_ids]
    if 'nothing' in parameters:
        # channels
        channels = db.session.query(Channel).filter(Channel.name.ilike(f"%{keyword}%"), Channel.workspace_id == workspace_id)
        result = result + [channel.to_dict() for channel in channels]
        # people
        people = db.session.query(User).filter(User.username.ilike(f"%{keyword}%"))
        result = result + [user.to_dict() for user in people]
        # messages
        messages = db.session.query(Message).filter(Message.content.ilike(f"%{keyword}%"))
        result = result + [message.to_dict() for message in messages if message.channel_id in channel_ids or message.room_id in room_ids]

    return { 'result': result }
