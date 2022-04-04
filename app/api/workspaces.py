# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
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

@bp.route('channels/<int:channel_id>')
def get_one_channel(channel_id):
    channel = Channel.query.get(channel_id)
    return channel.to_dict()


@bp.route('/', methods=['POST'])
def workspace_create():
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        workspace = Workspace(
            name=form.data['name'],
            owner_id=current_user.id
        )
        db.session.add(workspace)
        db.session.commit()

        workspaceMember = WorkspaceMember(
            workspace_id=Workspace.query.filter(Workspace.name == form.data['name']),
            user_id=current_user.id
        )
        db.session.add(workspaceMember)
        db.session.commit()

        return workspace.to_dict()


@bp.route('/<int:workspace_id>', methods=['PUT','DELETE'])
def workspace_edit_delete(workspace_id):
    if request.method == 'PUT':
        workspace = Workspace.query.get(workspace_id)
        data = request.json
        workspace.name = data['name']
        db.session.add(workspace)
        db.session.commit()
    if request.method == 'DELETE':
        db.session.query(Workspace).filter(Workspace.id == workspace_id).delete()
        db.session.commit()
        return {'workspace_id': workspace_id}
