import "./DmRooms.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CreateDmModal from "./DmForm/DmFormModal";
import { useDispatch } from "react-redux";

import { deleteDmRoom } from "../../../../store/dmRooms";
import { io } from "socket.io-client";
let socket;
const DmRooms = ({ workspace, users }) => {
  const user = useSelector((state) => state.session.user);
  const dmRoomsObj = useSelector((state) => state.dmRooms);
  const [dmRooms, setDmRooms] = useState(Object.values(dmRoomsObj.userDmRooms));
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  let history = useHistory();

  const [showDmRooms, setShowDmRooms] = useState(false);

  useEffect(() => {
    setLoaded(false);
    socket = io();
    socket.on("dm_rooms", (dm_rooms) => {
      if (dm_rooms.delete) {
        setDmRooms((dmRooms) =>
          dmRooms.filter((room) => {
            return room.dm_room_id !== dm_rooms.id;
          })
        );
      }
      setDmRooms((dmRooms) => [...dmRooms, dm_rooms]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    setDmRooms(Object.values(dmRoomsObj.userDmRooms));
    setLoaded(true);
  }, [dmRoomsObj]);

  const handleDelete = async (e, roomId) => {
    e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
    await dispatch(deleteDmRoom(roomId)).then((dmRoom) =>
      socket.emit("dm_rooms", { id: dmRoom.dm_room_id, delete: true })
    );
    let url = window.location.href;
    if (url.includes(`dm_rooms/${roomId}`)) {
      history.push(`/workspaces/${workspace.id}`);
    }
  };

  const dmRoom = async (e, id) => {
    e.preventDefault();
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };
  // console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", dm_rooms);
  return (
    loaded && (
      <div id="dm-rooms-list-main">
        <span id="dm-rooms-list-child">
          <button onClick={() => setShowDmRooms(!showDmRooms)}>
            <i className="fas fa-caret-right"></i>
          </button>
          <h3>Direct Messages</h3> <CreateDmModal socket={socket} />
          <button>
            <i className="fas fa-plus"></i>
          </button>
        </span>
        {showDmRooms &&
          dmRooms?.map((room) => (
            <div
              key={room.dm_room_id}
              onClick={(e) => dmRoom(e, room.dm_room_id)}
              id={room.id}
              className="single_dm_room"
            >
              <div className="single_dm_room_child">
                {room.neighbors?.members.map((member) => (
                  <div className="single_dm_room_child" key={member.id}>
                    {member.username}
                  </div>
                ))}
                {user.id === room.user_id && (
                  <button
                    key={room.dm_room_id * 500}
                    onClick={(e) => handleDelete(e, room.dm_room_id)}
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    )
  );
};

export default DmRooms;
