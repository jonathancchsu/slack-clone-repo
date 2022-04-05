import { useHistory } from "react-router-dom";

const DmRooms = ({ workspace, user }) => {
  let history = useHistory();
  const roomMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };
  return (
    <div>
      <h3>Direct Messages</h3>
      {workspace.message_rooms.map((room) => (
        <div key={room.id} onClick={() => roomMessages(room.id)} id={room.id}>
          <div>
            {room.members.map((member) => (
              <div key={member.id}>{member.username}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DmRooms;
