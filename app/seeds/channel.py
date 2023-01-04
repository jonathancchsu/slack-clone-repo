from app.models import db, Channel
from app.models.db import db, environment, SCHEMA

def seed_channels():
    channels = [{'name': 'General', 'topic': 'A place for everyone to chat' ,'description': 'This is a channel for all Workspace Necessities' , 'owner_id': 1, 'workspace_id': 1},{ 'name': 'General', 'topic': 'A place for everyone to chat' ,'description': 'This is a channel for all Workspace Necessities' , 'owner_id': 2, 'workspace_id': 2},{ 'name': 'General', 'topic': 'A place for everyone to chat' ,'description': 'This is a channel for all Workspace Necessities' , 'owner_id': 3, 'workspace_id': 3}]

    for channel in channels:
        new_channel =  Channel(
            name = channel['name'], topic = channel['topic'], description = channel['description'], owner_id= channel['owner_id'], workspace_id = channel['workspace_id']
        )
        db.session.add(new_channel)
        db.session.commit()

def undo_channels():
    db.session.execute('TRUNCATE channels RESTART IDENTITY CASCADE;')
    db.session.commit()
