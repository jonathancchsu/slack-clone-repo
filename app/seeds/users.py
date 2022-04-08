from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
    slack_bot = User(
        username='Slack Bot', email='slackbot@slackslackclone.com', password='slack54378965362183940201826354628192837', profile_picture='https://cdn.discordapp.com/attachments/958153208725897279/958829614745145384/favicon.png')
    demo = User(
        username='Demo', email='demo@demo.com', password='password', profile_picture='https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png')
    demo2 = User(
        username='Demo2', email='demo2@demo.com', password='password', profile_picture='https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png')
    demo3 = User(
        username='Demo3', email='demo3@demo.com', password='password', profile_picture='https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png')
    db.session.add(slack_bot)
    db.session.add(demo)
    db.session.add(demo2)
    db.session.add(demo3)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
