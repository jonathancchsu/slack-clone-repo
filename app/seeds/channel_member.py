from app.models import db, ChannelMember
from app.models.db import db, environment, SCHEMA

def seed_channel_member():
    members = [{ 'channel_id':1, 'user_id': 1},{ 'channel_id':1, 'user_id': 2},{ 'channel_id':1, 'user_id': 3},{ 'channel_id':2, 'user_id': 1},{ 'channel_id':2, 'user_id': 2},{ 'channel_id':2, 'user_id': 3},{ 'channel_id':3, 'user_id': 1},{ 'channel_id':3, 'user_id': 2},]

    for member in members:
        new_member =  ChannelMember(
            channel_id = member['channel_id'], user_id = member['user_id']
        )
        db.session.add(new_member)
        db.session.commit()

def undo_channel_members():
    db.session.execute('TRUNCATE channelMembers RESTART IDENTITY CASCADE;')
    db.session.commit()
