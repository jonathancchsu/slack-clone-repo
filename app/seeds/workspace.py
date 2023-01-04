from app.models import db, Workspace
from app.models.db import db, environment, SCHEMA

def seed_workspace():
    workspaces = [{'id': 1, 'owner_id':2, 'name': 'App Academy'},{'id': 2, 'owner_id': 3, 'name': 'Avengers'}, {'id': 4, 'owner_id':3, 'name': 'Justice League'}]

    for workspace in workspaces:
        new_workspace =  Workspace(
            owner_id = workspace['owner_id'], name = workspace['name']
        )
        db.session.add(new_workspace)
        db.session.commit()

def undo_workspace():
    db.session.execute('TRUNCATE workspaces RESTART IDENTITY CASCADE;')
    db.session.commit()
