import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const DmRooms = ({ workspace, users }) => {
  let history = useHistory();
  const user = useSelector((state) => state.session.user);
  console.log(user);
  const roomMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };
  return (
    <div>
      {" "}
      <div>
        <h3>Direct Messages</h3> <button>➕</button>
      </div>
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