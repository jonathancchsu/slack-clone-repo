from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func, table, column
from sqlalchemy.orm import relationship, Session
from alembic import op
from sqlalchemy.orm import Session
from .db import db

class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    topic = db.Column(String(100), nullable=False)
    description = db.Column(String(255), nullable=False)
    owner_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    workspace_id = db.Column(Integer, ForeignKey('workspaces.id'), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())

    members = relationship('ChannelMember', backref='channel',cascade="all, delete")
    messages = relationship('Message', backref='channel_messages',cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'topic': self.topic,
            'description': self.description,
            'owner_id': self.owner_id,
            'workspace_id': self.workspace_id,
            'members': [member.to_dict() for member in self.members],
            'messages': [message.to_dict() for message in self.messages],
        }

class ChannelMember(db.Model):
    __tablename__ = 'channelMembers'

    id = db.Column(Integer, primary_key=True)
    channel_id = db.Column(Integer, ForeignKey('channels.id'), nullable=False)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'channel_id': self.channel_id,
            'user_id': self.user_id,
            'username':self.member.username,

        }
