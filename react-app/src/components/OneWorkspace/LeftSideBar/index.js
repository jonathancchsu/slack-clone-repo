import Channels from "./Channels";
import DmRooms from "./DmRooms";
import Members from "./Members";
import CreateDmModal from "./DmRooms/DmForm/DmFormModal";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/session";

import "./LeftSideBar.css";

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [loaded, setLoaded] = useState(false);

  // const [loaded, setLoaded] = useState(false);

  const members = useSelector(
    (state) => state.workspace.currentWorkspace.members
  );
  const workspace = useSelector((state) => state.workspace.currentWorkspace);

  useEffect(() => {
    dispatch(getAllUsers());
    setLoaded(true);
  }, [dispatch, user, workspace]);

  return (
    loaded && (
      <div id="left-sb-main">
        <div className="left-sb-ws-name">
          <h2>{workspace.name}</h2>
          <CreateDmModal />
        </div>
        <div className="left-sb-container">
          <Members workspace={workspace} user={user} members={members} />
          <Channels workspace={workspace} />
          <DmRooms workspace={workspace} />
        </div>
      </div>
    )
  );
};

export default LeftSideBar;
