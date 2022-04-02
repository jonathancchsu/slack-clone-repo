from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func, table, column
from sqlalchemy.orm import relationship, Session
from alembic import op
from sqlalchemy.orm import Session
from .db import db


class DirectMessageRoom(db.Model):
    __tablename__ = 'directMessageRooms'

    id = db.Column(Integer, primary_key=True)
    owner_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    workspace_id = db.Column(Integer, ForeignKey('workspaces.id'), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())


    members = relationship('DirectMessageMember', backref='room',cascade="all, delete")
    messages = relationship('Message', backref='room_messages',cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'workspace_id': self.workspace_id,
            'members': [member.to_dict() for member in self.members],
            'messages': [message.to_dict() for message in self.messages],
    }


class DirectMessageMember(db.Model):
    __tablename__ = 'directMessageMembers'

    id = db.Column(Integer, primary_key=True)
    room_id = db.Column(Integer, ForeignKey('directMessageRooms.id'), nullable=False)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'user_id': self.user_id,
            'username':self.member.username,
    }
