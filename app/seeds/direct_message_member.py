from app.models import db, DirectMessageMember

def seed_direct_message_member():
    members = [{'id': 1, 'room_id':1, 'user_id': 1},{'id': 2, 'room_id':1, 'user_id': 2},{'id': 3, 'room_id':1, 'user_id': 3},{'id': 4, 'room_id':2, 'user_id': 1},{'id': 5, 'room_id':2, 'user_id': 2},{'id': 6, 'room_id':2, 'user_id': 3},{'id': 7, 'room_id':3, 'user_id': 1},{'id': 8, 'room_id':3, 'user_id': 2},{'id': 9, 'room_id':4, 'user_id': 3},{'id': 10, 'room_id':4, 'user_id': 1},{'id': 11, 'room_id':4, 'user_id': 2},{'id': 12, 'room_id':4, 'user_id': 3},{'id': 13, 'room_id':5, 'user_id': 1},{'id': 14, 'room_id':5, 'user_id': 2},{'id': 15, 'room_id':5, 'user_id': 3},{'id': 16, 'room_id':6, 'user_id': 1},{'id': 17, 'room_id':6, 'user_id': 2},{'id': 18, 'room_id':6, 'user_id': 3},{'id': 19, 'room_id':7, 'user_id': 1},{'id': 20, 'room_id':7, 'user_id': 2},{'id': 21, 'room_id':7, 'user_id': 3},{'id': 22, 'room_id':8, 'user_id': 1},{'id': 23, 'room_id':8, 'user_id': 2},{'id': 24, 'room_id':8, 'user_id': 3},{'id': 25, 'room_id':9, 'user_id': 1},{'id': 26, 'room_id':9, 'user_id': 2},{'id': 27, 'room_id':9, 'user_id': 3},]

    for member in members:
        new_member =  DirectMessageMember(
            room_id = member.id, user_id = member.user_id
        )
        db.session.add(new_member)
        db.session.commit()

def undo_members():
    db.session.execute('TRUNCATE directMessageMembers RESTART IDENTITY CASCADE;')
    db.session.commit()
