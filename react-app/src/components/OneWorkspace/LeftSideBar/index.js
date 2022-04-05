// import { useHistory } from "react-router-dom";

import Channels from "./Channels";
import DmRooms from "./DmRooms";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";
import { addAMember } from "../../../store/workspace";
import { getOneWorkspace } from "../../../store/workspace";
import { useHistory } from "react-router-dom";

const LeftSideBar = ({ workspace }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.session.users);
  const [user_id, setUserID] = useState(workspace.owner.id);
  const current_workspace = useSelector(state => state.workspace.currentWorkspace);

  const members = current_workspace.members.map(member => member.user_id);

  console.log(typeof(members[0]), 'member number 1');
  console.log('member ids............', members)

  console.log('current workspace:', current_workspace)
  console.log('current user selected', user_id, typeof(user_id))


  const onSubmit = (e) => {
    e.preventDefault();
    console.log('user_id:', typeof(user_id))
    const member_exists = members.indexOf(Number(user_id))
    console.log('member exists?:', member_exists)
    if (member_exists === -1) {
      console.log(user_id, members.indexOf(+user_id))
      dispatch(addAMember(user_id, workspace.id))
      // history.push('/'))
    }
    dispatch(getOneWorkspace(workspace.id))
  };

  useEffect(() => {
    dispatch(getAllUsers()).then(() => dispatch(getOneWorkspace(workspace.id)))
    ;
  }, [dispatch]);

  return (
    <div>
      <h2>{workspace.name}</h2>
      <h6>Members:</h6>
      {current_workspace.members?.map (member => (
        <div key={member.id}>{member.username}</div>
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
