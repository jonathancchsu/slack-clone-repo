import { useHistory } from "react-router-dom";

const LeftSideBar = ({ workspace }) => {
  let history = useHistory();

  const channelMessages = (id) => {
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };
  const roomMessages = (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };
  return (
    <div>
      <h2>{workspace.name}</h2>
      <div>
        <h3>Channels</h3>
        {workspace.channels.map((channel) => (
          <div key={channel.id} onClick={() => channelMessages(channel.id)}>
            # {channel.name}
          </div>
        ))}
      </div>
      <div>
        <h3>Direct Messages</h3>
        {workspace.message_rooms.map((room) => (
          <ul key={room.id} onClick={() => roomMessages(room.id)}>
            {room.members.map((member) => (
              <li key={member.id}>{member.username}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
