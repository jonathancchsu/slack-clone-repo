import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import CreateDmModal from "./DmForm/DmFormModal";
const DmRooms = ({ workspace, users }) => {

  const [loaded, setLoaded] = useState(false);

  let history = useHistory();
  const user = useSelector((state) => state.session.user);
  const dmRoomsObj = useSelector((state) => state.dmRooms);
  const dmRooms = Object.values(dmRoomsObj.userDmRooms);

  const [showDmRooms, setShowDmRooms] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setLoaded(true);
  }, [user, workspace]);
  const dmRoom = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };
  return (
    loaded && (
      <div id='dm-rooms-list-main'>
        <span id='dm-rooms-list-child'>
        <button onClick={() => setShowDmRooms(!showDmRooms)}><i className="fas fa-caret-right"></i></button>
          <h3>Direct Messages</h3> <CreateDmModal />
          <button><i className="fas fa-plus"></i></button>
        </span>
        { showDmRooms && dmRooms.map((room) => (
          <div
            key={room.dm_room_id}
            onClick={() => dmRoom(room.dm_room_id)}
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
