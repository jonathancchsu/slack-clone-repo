# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
from app.forms.channel_form import ChannelForm
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db
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


@bp.route('/channels/new', methods=['POST'])
def channel_create():
    data = request.json
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel(
            name=form.data['name'],
            topic=form.data['topic'],
            description=form.data['description'],
            owner_id=data['owner_id'],
            workspace_id=data['workspace_id'],
        )
        db.session.add(channel)
        db.session.commit()


        channelMember = ChannelMember(
            channel_id=channel.id,
            user_id=channel.owner_id,
        )
        db.session.add(channelMember)
        db.session.commit()

        return channel.to_dict()



@bp.route('channels/<int:channel_id>', methods=['GET', 'PUT', 'DELETE'])
def channel(channel_id):
    if request.method == 'GET':
        channel = Channel.query.get(channel_id)
        return channel.to_dict()

    if request.method == 'PUT':
        channel = Channel.query.get(channel_id)
        data = request.json
        channel.name = data['name']
        channel.topic = data['topic']
        channel.description = data['description']
        db.session.commit()
        return {'channel_id': channel_id}

    if request.method == 'DELETE':
        channel = db.session.query(Channel).filter(Channel.id == channel_id).first()
        db.session.delete(channel)
        db.session.commit()
        return {'channel_id': channel_id}


@bp.route('members/<int:channel_id>/<int:user_id>', methods=['POST'])
def add_channel_member(channel_id, user_id):
    data = request.json
    member = ChannelMember(
        channel_id = channel_id,
        user_id = user_id,
    )
    db.session.add(member)
    db.session.commit()
    return {'member': member};

# @bp.route('/<int:user_id>')
# def get_all_workspaces(user_id):
#     user = User.query(user_id)
#     workspaces = User.query.filter().all()
#     return

@bp.route('/new', methods=['POST'])
def workspace_create():
    # print("current user here ___________________",current_user)
    data = request.json
    print('hereeeeeeeeeeeeeeeeeeeeeeeeee', data)
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # print('curent user here',current_user)
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
        print('workspacemember here ----------------------------',workspaceMember)
        db.session.add(workspaceMember)
        db.session.commit()

        return workspace.to_dict()


@bp.route('/<int:workspace_id>', methods=['PUT','DELETE'])
def workspace_edit_delete(workspace_id):
    if request.method == 'PUT':
        workspace = Workspace.query.get(workspace_id)
        data = request.json
        workspace.name = data['name']
        db.session.commit()
        return {'workspace_id': workspace_id}
    if request.method == 'DELETE':
        workspace = db.session.query(Workspace).filter(Workspace.id == workspace_id).first()
        db.session.delete(workspace)
        db.session.commit()
        return {'workspace_id': workspace_id}

@bp.route('members/<int:workspace_id>/<int:user_id>', methods=['POST'])
def add_workspace_member(workspace_id, user_id):
    data = request.json
    print(user_id, '...........................', workspace_id)


    member = WorkspaceMember(
        workspace_id = workspace_id,
        user_id = user_id,
    )
    db.session.add(member)
    db.session.commit()
    return {'member': data};
