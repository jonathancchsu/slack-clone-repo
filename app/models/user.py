from app.models.workspace import Workspace
from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func, table, column
from sqlalchemy.orm import relationship, Session
from alembic import op
from sqlalchemy.orm import Session

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(String(2000))
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())


    workspaces_owned = relationship('Workspace', backref='owner',cascade="all, delete")

    workspace_member = relationship('WorkspaceMember', backref='member')

    channels_owned = relationship('Channel', backref='owner',cascade="all, delete" )

    channel_member = relationship('ChannelMember', backref='member')

    dm_rooms_owned = relationship('DirectMessageRoom', backref='owner',cascade="all, delete")

    dm_room_member = relationship('DirectMessageMember', backref='member',cascade="all, delete")

    messages_sent = relationship('Message', backref='sender',cascade="all, delete")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
        'id': self.id,
        'username': self.username,
        'email':self.email,
        'profile_picture': self.profile_picture,
        'workspaces_owned': [workspace.id for workspace in self.workspaces_owned],
        'workspace_member': [{'id':workspace.workspace_id, 'name': workspace.workspace.name, 'members_length': len(workspace.workspace.members)  }for workspace in self.workspace_member],
        'channels_owned': [channel.id for channel in self.channels_owned],
        'channel_member': [{'membership_id':member.id, 'channel_id': member.channel_id, 'user_id': member.user_id, 'channel_data':member.channel.to_dict(), 'workspace_id': member.channel.workspace_id} for member in self.channel_member],
        'channels_owned': [channel.id for channel in self.dm_rooms_owned],
        'dm_room_member': [{'membership_id':member.id, 'dm_room_id': member.room_id, 'user_id':member.user_id, 'workspace_id': member.room.workspace_id, 'neighbors': member.room.to_dict() }for member in self.dm_room_member],
        'messages_sent': [message.id for message in self.messages_sent],
    }
