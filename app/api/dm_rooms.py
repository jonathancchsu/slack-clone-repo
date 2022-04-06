# from crypt import methods
from flask import Blueprint, render_template, redirect, url_for, request
from app.forms.channel_form import ChannelForm
# from flask_login import login_required
# from sqlalchemy.orm import Session
from app.models import User, Workspace, WorkspaceMember, Channel, ChannelMember, Message, DirectMessageRoom, DirectMessageMember, db
from flask_login import current_user, login_user, logout_user, login_required
from app.forms.channel_form import ChannelForm

import json

bp = Blueprint('dm_rooms', __name__,)
@bp.route('/', methods=['POST'])
def dm_create():
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



@bp.route('/<int:dm_room_id>', methods=['GET', 'PUT', 'DELETE'])
def dm(channel_id):
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
        return channel.to_dict()

    if request.method == 'DELETE':
        channel = db.session.query(Channel).filter(Channel.id == channel_id).first()
        db.session.delete(channel)
        db.session.commit()
        return {'channel_id': channel_id}
