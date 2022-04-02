from app.models import db, WorkspaceMember

def seed_workspace_member():
    members = [{'id': 1, 'workspace_id': 1, 'user_id': 1},{'id': 2, 'workspace_id': 1, 'user_id': 2},{'id': 3, 'workspace_id': 1, 'user_id': 3},{'id': 4, 'workspace_id': 2, 'user_id': 1},{'id': 5, 'workspace_id': 2, 'user_id': 2},{'id': 6, 'workspace_id': 2, 'user_id': 3},{'id': 7, 'workspace_id': 3, 'user_id': 1},{'id': 8, 'workspace_id': 3, 'user_id': 2},{'id': 9, 'workspace_id': 3, 'user_id': 3},]

    for member in members:
        new_member =  WorkspaceMember(
            workspace_id = member.workspace_id, user_id = member.user_id
        )
        db.session.add(new_member)
        db.session.commit()

def undo_workspace_member():
    db.session.execute('TRUNCATE workspaceMembers RESTART IDENTITY CASCADE;')
    db.session.commit()
