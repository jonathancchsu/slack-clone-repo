// import { useHistory } from "react-router-dom";

import Channels from "./Channels";
import DmRooms from "./DmRooms";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";
import { addAMember } from "../../../store/workspace";
import { getOneWorkspace } from "../../../store/workspace";
import { setChannels, setDmRooms } from "../../../store/currentView";


const LeftSideBar = ({ workspace }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.session.users);
  const [user_id, setUserID] = useState(workspace.owner.id);
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const members = useSelector(
    (state) => state.workspace.currentWorkspace.members.map(member => member.user_id)
  );
  const current_workspace = useSelector(
    (state) => state.workspace.currentWorkspace.members
  );

  console.log('workspace...', workspace)
  console.log(members, 'members now!')

  console.log('user_id:', user_id)
  console.log('current workspace:', current_workspace)
  const onSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    console.log("user_id:------------------", typeof user_id);
    const member_exists = members.indexOf(Number(user_id));
    console.log("member exists?:", member_exists);
    if (member_exists === -1) {
      console.log('dispatched!!!!!!!!!!!!');
      dispatch(addAMember(user_id, workspace.id));
    } else {
      setErrors(["That user is already a member of this workspace"]);
    }
    dispatch(getOneWorkspace(workspace.id));
  };

  useEffect(() => {
    dispatch(getAllUsers()).then(() => dispatch(getOneWorkspace(workspace.id)));
  }, [dispatch, workspace.id]);

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
    dispatch(getAllUsers()).then(() => dispatch(getOneWorkspace(workspace.id)))
    ;
  }, [dispatch, workspace.id]);

  return (
    <div>
      <h2>{workspace.name}</h2>
      <h6>Members:</h6>
      {current_workspace?.map((member) => (
        <div key={`member:${member.username}`}>{member.username}</div>
      ))}
      {errors?.map((error) => (
        <p key={error} style={{ color: "red" }}>
          {error}
        </p>
      ))}
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
