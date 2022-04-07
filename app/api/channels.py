# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
from app.forms.channel_form import ChannelForm
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db
from flask_login import current_user, login_user, logout_user, login_required
from app.forms.channel_form import ChannelForm

import json

bp = Blueprint('channels', __name__,url_prefix='channels')
@bp.route('/', methods=['POST'])
def channel_create():
    data = request.json
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel(
            name=data['name'],
            topic=data['topic'],
            description=data['description'],
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

        return {'channel_id': channel.id, 'membership_id': channelMember.id, 'user_id':channel.owner_id, 'workspace_id': data['workspace_id'], 'channel_data': channel.to_dict()}

@bp.route('/<int:channel_id>', methods=['GET', 'PUT', 'DELETE'])
def channel(channel_id):
    if request.method == 'GET':
        channel = Channel.query.get(channel_id)
        return channel.to_dict()

    if request.method == 'PUT':
        data = request.json
        channel = Channel.query.get(data['id'])
        channel.name = data['name']
        channel.topic = data['topic']
        channel.description = data['description']
        db.session.commit()

        return {
            "channel_data": channel.to_dict(),
            "channel_id": channel.id,
            "membership_id": 1,
            "user_id": channel.owner_id,
            "workspace_id": channel.workspace_id
        }

    if request.method == 'DELETE':
        channel = Channel.query.get(channel_id)
        db.session.delete(channel)
        db.session.commit()
        return {'channel_id': channel_id}

@bp.route('/<int:channel_id>/new_member', methods=['POST'])
def add_member(channel_id):
    data = request.json
    channel = Channel.query.get(channel_id)
    user = User.query.filter(User.username == data).first()

    channelMember = ChannelMember(
        channel_id=channel.id,
        user_id=user.id,
    )

    db.session.add(channelMember)
    db.session.commit()
    return { "channel_id": channel.id, "id": channelMember.id, "user_id": user.id, "username": user.username, "workspace_id": channel.workspace_id }
