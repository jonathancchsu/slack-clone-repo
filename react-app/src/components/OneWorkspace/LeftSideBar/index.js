import Channels from "./Channels";
import DmRooms from "./DmRooms";
import Members from "./Members";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";

import './LeftSideBar.css';

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const [loaded, setLoaded] = useState(false);

  const members = useSelector(
    (state) => state.workspace.currentWorkspace.members
  );
  const workspace = useSelector(
    (state) => state.workspace.currentWorkspace
  );

  useEffect(() => {
    dispatch(getAllUsers());
    setLoaded(true);
  }, [dispatch, user, workspace]);

  return (
    loaded && (
      <div id='left-sb-main'>
        <h2>{workspace.name}</h2>
        <Members workspace={workspace} user={user} members={members}/>
        <Channels workspace={workspace}/>
        <DmRooms workspace={workspace}/>
      </div>
    )
  );
};

export default LeftSideBar;
