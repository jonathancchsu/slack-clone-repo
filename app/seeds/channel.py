from app.models import db, Channel

def seed_channel():
    channels = [{'id': 1, 'name': 'test1', 'topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 1, 'workspace_id': 1},{'id': 2, 'name': 'test2','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 2, 'workspace_id': 1},{'id': 3, 'name': 'test3','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 3, 'workspace_id': 1},{'id': 4, 'name': 'test1', 'topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 1, 'workspace_id': 2},{'id': 5, 'name': 'test2','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 2, 'workspace_id': 2},{'id': 6, 'name': 'test3','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 3, 'workspace_id': 2},{'id': 7, 'name': 'test1','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 1, 'workspace_id': 3},{'id': 8, 'name': 'test2','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 2, 'workspace_id': 3},{'id': 9, 'name': 'test3','topic': 'test topic' , 'description': 'This is a channel about test description' , 'owner_id': 3, 'workspace_id': 3},]

    for channel in channels:
        new_channel =  Channel(
            name = channel.name, topic = channel.topic, description = channel.description, owner_id= channel.owner_id, workspace_id = channel.workspace_id
        )
        db.session.add(new_channel)
        db.session.commit()

def undo_channels():
    db.session.execute('TRUNCATE channels RESTART IDENTITY CASCADE;')
    db.session.commit()
