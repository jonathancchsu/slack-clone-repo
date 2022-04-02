from app.models import db, DirectMessageRoom

def seed_dm_rooms():
    rooms = [{'id': 1, 'owner_id': 1, 'workspace_id': 1},{'id': 2, 'owner_id': 2, 'workspace_id': 1},{'id': 3, 'owner_id': 3, 'workspace_id': 1},{'id': 4, 'owner_id': 1, 'workspace_id': 2},{'id': 5, 'owner_id': 2, 'workspace_id': 2},{'id': 6, 'owner_id': 3, 'workspace_id': 2},{'id': 7, 'owner_id': 1, 'workspace_id': 3},{'id': 8, 'owner_id': 2, 'workspace_id': 3},{'id': 9, 'owner_id': 3, 'workspace_id': 3},]

    for room in rooms:
        new_room =  DirectMessageRoom(
            owner_id = room['owner_id'], workspace_id = room['workspace_id']
        )
        db.session.add(new_room)
        db.session.commit()

def undo_dm_rooms():
    db.session.execute('TRUNCATE directMessageRooms RESTART IDENTITY CASCADE;')
    db.session.commit()
