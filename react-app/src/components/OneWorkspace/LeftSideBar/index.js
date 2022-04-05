// import { useHistory } from "react-router-dom";

import Channels from "./Channels";
import DmRooms from "./DmRooms";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";
import { addAMember } from "../../../store/workspace";
import { setChannels, setDmRooms } from "../../../store/currentView";

const LeftSideBar = ({ workspace }) => {
  // let history = useHistory();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.session.users);
  const [user_id, setUserID] = useState(workspace.owner.id);
  const user = useSelector((state) => state.session.user);
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addAMember(user_id, workspace.id));
    // return history.push('/')
  };
  useEffect(() => {
    let dmRooms = user.dm_room_member.filter((room) => {
      return room.workspace_id === workspace.id;
    });
    let channels = user.channel_member.filter(
      (channel) => channel.workspace_id === workspace.id
    );

    dispatch(setChannels(channels));
    dispatch(setDmRooms(dmRooms));
  }, [dispatch, workspace, user]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div>
      <h2>{workspace.name}</h2>
      <select value={user_id} onChange={(e) => setUserID(e.target.value)}>
        {users?.map((user) => (
          <option value={user.id} key={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={onSubmit}>Add User</button>

      <Channels workspace={workspace} users={users} />

      <DmRooms workspace={workspace} users={users} />
    </div>
  );
};

export default LeftSideBar;
