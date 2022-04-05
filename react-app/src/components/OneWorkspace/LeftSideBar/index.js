import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUsers } from "../../../store/session";

const LeftSideBar = ({ workspace }) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const users = useSelector(state => state.session.users)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [])

  const channelMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };
  const roomMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };



  return (
    <div>
      <h2>{workspace.name}</h2>
      <form>
        <select>
         {
           users?.map((user => (
             <option key={user.id}>{user.username}</option>
           )))
         }
        </select>
        <button>Add User</button>
      </form>
      <div>
        <h3>Channels</h3>
        {workspace.channels.map((channel) => (
          <div onClick={() => channelMessages(channel.id)} key={channel.id}>
            # {channel.name}
          </div>
        ))}
      </div>
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
    </div>
  );
};

export default LeftSideBar;
