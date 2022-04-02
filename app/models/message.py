from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func, table, column
from sqlalchemy.orm import relationship, Session
from alembic import op
from sqlalchemy.orm import Session
from .db import db

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(Integer, primary_key=True)
    room_id = db.Column(Integer, ForeignKey('directMessageRooms.id'))
    channel_id = db.Column(Integer, ForeignKey('channels.id'))
    sender_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    content = db.Column(String(2000), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'channel_id': self.channel_id,
            'sender_id': self.sender_id,
            'sender_username':self.sender.username,
            'content': self.content,
            'created_at': self.created_at,
             'updated_at': self.updated_at
    }
