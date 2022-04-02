# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db

import json

bp = Blueprint('workspaces', __name__, url_prefix='workspaces')


@bp.route('/<int:workspace_id>')
def get_one_workspace(workspace_id):
    workspace = Workspace.query.get(workspace_id)
    return workspace.to_dict()




@bp.route('dm/<int:dm_id>')
def get_one_group_message(dm_id):
    dm_room = DirectMessageRoom.query.get(dm_id)
