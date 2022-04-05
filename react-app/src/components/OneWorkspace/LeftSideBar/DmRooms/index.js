import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const DmRooms = ({ workspace, users }) => {
  const [loaded, setLoaded] = useState(false);

  let history = useHistory();
  const user = useSelector((state) => state.session.user);
  const dmRooms = useSelector((state) => state.currentView.dm_rooms);

  useEffect(() => {
    setLoaded(false);
    setLoaded(true);
  }, [user, workspace]);
  const roomMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };
  return (
    loaded && (
      <div>
        {" "}
        <div>
          <h3>Direct Messages</h3> <button>➕</button>
        </div>
        {dmRooms.map((room) => (
          <div
            key={room.dm_room_id}
            onClick={() => roomMessages(room.dm_room_id)}
            id={room.id}
          >
            <div>
              {room.neighbors.members.map((member) => (
                <div key={member.id}>{member.username}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default DmRooms;
