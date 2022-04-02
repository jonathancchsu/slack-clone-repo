from flask.cli import AppGroup
from .users import seed_users, undo_users
from .workspace import seed_workspace, undo_workspace
from .workspace_member import seed_workspace_member, undo_workspace_member
from .channel import seed_channels, undo_channels
from .channel_member import seed_channel_member, undo_channel_members
from .direct_message_room import seed_dm_rooms, undo_dm_rooms
from .direct_message_member import seed_dm_members, undo_dm_members
from .message import seed_messages, undo_messages

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_workspace()
    seed_workspace_member()
    seed_channels()
    seed_channel_member()
    seed_dm_rooms()
    seed_dm_members()
    seed_messages()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_workspace()
    undo_workspace_member()
    undo_channels(),
    undo_channel_members()
    undo_dm_rooms()
    undo_dm_members()
    undo_messages()
    # Add other undo functions here
