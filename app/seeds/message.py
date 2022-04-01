from app.models import db, Message

def seed_message():
    channel_messages = [{'id': 1, 'channel_id':1, 'sender_id': 1, 'content': 'test'},{'id': 2, 'channel_id':1, 'sender_id': 2, 'content': 'test'},{'id': 3, 'channel_id':1, 'sender_id': 3, 'content': 'test'},{'id': 4, 'channel_id':2, 'sender_id': 1, 'content': 'test'},{'id': 5, 'channel_id':2, 'sender_id': 2, 'content': 'test'},{'id': 6, 'channel_id':2, 'sender_id': 3, 'content': 'test'},{'id': 7, 'channel_id':3, 'sender_id': 1, 'content': 'test'},{'id': 8, 'channel_id':3, 'sender_id': 2, 'content': 'test'},{'id': 9, 'channel_id':4, 'sender_id': 3, 'content': 'test'},{'id': 10, 'channel_id':4, 'sender_id': 1, 'content': 'test'},{'id': 11, 'channel_id':4, 'sender_id': 2, 'content': 'test'},{'id': 12, 'channel_id':4, 'sender_id': 3, 'content': 'test'},{'id': 13, 'channel_id':5, 'sender_id': 1, 'content': 'test'},{'id': 14, 'channel_id':5, 'sender_id': 2, 'content': 'test'},{'id': 15, 'channel_id':5, 'sender_id': 3, 'content': 'test'},{'id': 16, 'channel_id':6, 'sender_id': 1, 'content': 'test'},{'id': 17, 'channel_id':6, 'sender_id': 2, 'content': 'test'},{'id': 18, 'channel_id':6, 'sender_id': 3, 'content': 'test'},{'id': 19, 'channel_id':7, 'sender_id': 1, 'content': 'test'},{'id': 20, 'channel_id':7, 'sender_id': 2, 'content': 'test'},{'id': 21, 'channel_id':7, 'sender_id': 3, 'content': 'test'},{'id': 22, 'channel_id':8, 'sender_id': 1, 'content': 'test'},{'id': 23, 'channel_id':8, 'sender_id': 2, 'content': 'test'},{'id': 24, 'channel_id':8, 'sender_id': 3, 'content': 'test'},{'id': 25, 'channel_id':9, 'sender_id': 1, 'content': 'test'},{'id': 26, 'channel_id':9, 'sender_id': 2, 'content': 'test'},{'id': 27, 'channel_id':9, 'sender_id': 3, 'content': 'test'},]
    room_messages = [{'id': 28, 'room_id':1, 'sender_id': 1, 'content': 'test'},{'id': 30, 'room_id':1, 'sender_id': 2, 'content': 'test'},{'id': 31, 'room_id':1, 'sender_id': 3, 'content': 'test'},{'id': 32, 'room_id':2, 'sender_id': 1, 'content': 'test'},{'id': 33, 'room_id':2, 'sender_id': 2, 'content': 'test'},{'id': 34, 'room_id':2, 'sender_id': 3, 'content': 'test'},{'id': 35, 'room_id':3, 'sender_id': 1, 'content': 'test'},{'id': 36, 'room_id':3, 'sender_id': 2, 'content': 'test'},{'id': 37, 'room_id':4, 'sender_id': 3, 'content': 'test'},{'id': 38, 'room_id':4, 'sender_id': 1, 'content': 'test'},{'id': 39, 'room_id':4, 'sender_id': 2, 'content': 'test'},{'id': 40, 'room_id':4, 'sender_id': 3, 'content': 'test'},{'id': 41, 'room_id':5, 'sender_id': 1, 'content': 'test'},{'id': 42, 'room_id':5, 'sender_id': 2, 'content': 'test'},{'id': 43, 'room_id':5, 'sender_id': 3, 'content': 'test'},{'id': 44, 'room_id':6, 'sender_id': 1, 'content': 'test'},{'id': 45, 'room_id':6, 'sender_id': 2, 'content': 'test'},{'id': 46, 'room_id':6, 'sender_id': 3, 'content': 'test'},{'id': 47, 'room_id':7, 'sender_id': 1, 'content': 'test'},{'id': 48, 'room_id':7, 'sender_id': 2, 'content': 'test'},{'id': 49, 'room_id':7, 'sender_id': 3, 'content': 'test'},{'id': 50, 'room_id':8, 'sender_id': 1, 'content': 'test'},{'id': 51, 'room_id':8, 'sender_id': 2, 'content': 'test'},{'id': 52, 'room_id':8, 'sender_id': 3, 'content': 'test'},{'id': 53, 'room_id':9, 'sender_id': 1, 'content': 'test'},{'id': 54, 'room_id':9, 'sender_id': 2, 'content': 'test'},{'id': 55, 'room_id':9, 'sender_id': 3, 'content': 'test'}]

    for message in channel_messages:
        new_message =  Message(
            channel_id = message.channel_id, sender_id = message.user_id, content= message.content
        )
        db.session.add(new_message)
        db.session.commit()
    for message in room_messages:
        new_message =  Message(
            room_id = message.room_id, sender_id = message.user_id, content= message.content
        )
        db.session.add(new_message)
        db.session.commit()

def undo_members():
    db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
    db.session.commit()
