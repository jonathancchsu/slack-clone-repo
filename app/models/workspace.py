from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func, table, column
from sqlalchemy.orm import relationship, Session, backref
from alembic import op
from sqlalchemy.orm import Session
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Workspace(db.Model):
    __tablename__ = 'workspaces'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(Integer, primary_key=True)
    owner_id = db.Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False,)
    name = db.Column(String(100), nullable=False, unique=True)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())


    channels = relationship('Channel', backref='workspace', cascade="all,delete-orphan")

    direct_message_rooms = relationship('DirectMessageRoom', backref='workspace',cascade="all,delete-orphan")

    members = relationship('WorkspaceMember', cascade='all, delete, delete-orphan', backref='workspace')



    def to_dict(self):
        return {
            'id': self.id,
            'owner': {'id':self.owner.id, 'username': self.owner.username},
            'name': self.name,
            'channels':[{'id': channel.id,'name':channel.name} for channel in self.channels],
            'message_rooms': [{'id':dm_room.id, 'members': [{'id':member.member.id, 'username': member.member.username} for member in dm_room.members]} for dm_room in self.direct_message_rooms],
            'members': [member.to_dict() for member in self.members],
        }

class WorkspaceMember(db.Model):
    __tablename__ = 'workspaceMembers'

    id = db.Column(Integer, primary_key=True)
    workspace_id = db.Column(Integer, db.ForeignKey('workspaces.id', passive_deletes=True), nullable=False)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'workspace_id': self.workspace_id,
            'user_id': self.user_id,
            'username':self.member.username,
        }
