from app.models import db, Workspace

def seed_workspace():
    workspaces = [{'id': 1, 'owner_id':1, 'name': 'test workspace1'},{'id': 2, 'owner_id': 2, 'name': 'test workspace2'}, {'id': 3, 'owner_id':3, 'name': 'test workspace3'}]

    for workspace in workspaces:
        new_workspace =  Workspace(
            owner_id = workspace.owner_id, name = workspace.name
        )
        db.session.add(new_workspace)
        db.session.commit()

def undo_workspace():
    db.session.execute('TRUNCATE workspaces RESTART IDENTITY CASCADE;')
    db.session.commit()
