import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";
import { addAMember } from "../../../store/workspace";


const LeftSideBar = ({ workspace }) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const users = useSelector(state => state.session.users)
  const [user_id, setUserID] = useState(workspace.owner.id);



  const onSubmit = (e) => {
    e.preventDefault();
    console.log('user_id:', user_id)
    dispatch(addAMember(user_id, workspace.id))
    // return history.push('/')
  }

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  const channelMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };
  const roomMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${id}`);
  };



  return (
    <div>
      <h2>{workspace.name}</h2>
        <select
          value ={user_id}
          onChange={(e) => setUserID(e.target.value)}
        >
         {
           users?.map((user => (
             <option value = {user.id} key={user.id}>{user.username}</option>
           )))
         }
        </select>
        <button onClick={onSubmit}>Add User</button>
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
