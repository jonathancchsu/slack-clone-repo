// import { useHistory } from "react-router-dom";

import Channels from "./Channels";
import DmRooms from "./DmRooms";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";
import { addAMember } from "../../../store/workspace";
import { getOneWorkspace } from "../../../store/workspace";


const LeftSideBar = ({ workspace }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.session.users);
  const [user_id, setUserID] = useState(workspace.owner.id);
  const [errors, setErrors] = useState([])
  const current_workspace = useSelector(state => state.workspace.currentWorkspace);

  const members = current_workspace.members.map(member => member.user_id);

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    console.log('user_id:', typeof(user_id))
    const member_exists = members.indexOf(Number(user_id))
    console.log('member exists?:', member_exists)
    if (member_exists === -1) {
      console.log(user_id, members.indexOf(+user_id))
      dispatch(addAMember(user_id, workspace.id))
    } else {
      setErrors(['That user is already a member of this workspace'])
    }
    dispatch(getOneWorkspace(workspace.id))
  };

  useEffect(() => {
    dispatch(getAllUsers()).then(() => dispatch(getOneWorkspace(workspace.id)))
    ;
  }, [dispatch, workspace.id]);

  return (
    <div>
      <h2>{workspace.name}</h2>
      <h6>Members:</h6>
      {current_workspace.members?.map (member => (
        <div key={`member:${member.username}`}>{member.username}</div>
      ))}
      {errors?.map(error => (
        <p key={error} style={{color:'red'}}>{error}</p>
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
