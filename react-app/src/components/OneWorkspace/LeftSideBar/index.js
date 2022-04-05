// import { useHistory } from "react-router-dom";

import Channels from "./Channels";
import DmRooms from "./DmRooms";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";
import { addAMember } from "../../../store/workspace";

const LeftSideBar = ({ workspace }) => {
  // let history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.users);
  const [user_id, setUserID] = useState(workspace.owner.id);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("user_id:", user_id);
    dispatch(addAMember(user_id, workspace.id));
    // return history.push('/')
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div>
      <h2>{workspace.name}</h2>
      <select value={user_id} onChange={(e) => setUserID(e.target.value)}>
        {user?.map((user) => (
          <option value={user.id} key={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={onSubmit}>Add User</button>

      <Channels workspace={workspace} user={user} />

      <DmRooms workspace={workspace} user={user} />
    </div>
  );
};

export default LeftSideBar;
