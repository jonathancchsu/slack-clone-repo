from app.models import db, ChannelMember

def seed_channel_member():
    members = [{'id': 1, 'channel_id':1, 'user_id': 1},{'id': 2, 'channel_id':1, 'user_id': 2},{'id': 3, 'channel_id':1, 'user_id': 3},{'id': 4, 'channel_id':2, 'user_id': 1},{'id': 5, 'channel_id':2, 'user_id': 2},{'id': 6, 'channel_id':2, 'user_id': 3},{'id': 7, 'channel_id':3, 'user_id': 1},{'id': 8, 'channel_id':3, 'user_id': 2},{'id': 9, 'channel_id':4, 'user_id': 3},{'id': 10, 'channel_id':4, 'user_id': 1},{'id': 11, 'channel_id':4, 'user_id': 2},{'id': 12, 'channel_id':4, 'user_id': 3},{'id': 13, 'channel_id':5, 'user_id': 1},{'id': 14, 'channel_id':5, 'user_id': 2},{'id': 15, 'channel_id':5, 'user_id': 3},{'id': 16, 'channel_id':6, 'user_id': 1},{'id': 17, 'channel_id':6, 'user_id': 2},{'id': 18, 'channel_id':6, 'user_id': 3},{'id': 19, 'channel_id':7, 'user_id': 1},{'id': 20, 'channel_id':7, 'user_id': 2},{'id': 21, 'channel_id':7, 'user_id': 3},{'id': 22, 'channel_id':8, 'user_id': 1},{'id': 23, 'channel_id':8, 'user_id': 2},{'id': 24, 'channel_id':8, 'user_id': 3},{'id': 25, 'channel_id':9, 'user_id': 1},{'id': 26, 'channel_id':9, 'user_id': 2},{'id': 27, 'channel_id':9, 'user_id': 3},]

    for member in members:
        new_member =  ChannelMember(
            channel_id = member.channel_id, user_id = channel.user_id
        )
        db.session.add(new_member)
        db.session.commit()

def undo_channel_members():
    db.session.execute('TRUNCATE channelMembers RESTART IDENTITY CASCADE;')
    db.session.commit()
