import "./OneWorkspace.css";

import { getOneWorkspace } from "../../store/workspace";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import LeftSideBar from "./LeftSideBar";
import MainContent from "./MainContent.js";
import { setUserChannels } from "../../store/channel";
import { setUserDmRooms } from "../../store/dmRooms";

const OneWorkspace = () => {
  let { workspaceId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const workspacesObj = useSelector((state) => state.workspace);
  const workspaces = Object.values(workspacesObj.userWorkspaces);
  const workspace = workspaces.find(
    (workspace) => workspace.id === workspaceId
  );
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    setLoaded(false);
    let dmRooms = user.dm_room_member.filter((room) => {
      return room.workspace_id === workspaceId * 1;
    });
    let channels = user.channel_member.filter((channel) => {
      return channel.workspace_id === workspaceId * 1;
    });
    dispatch(getOneWorkspace(workspaceId))
      .then(() => dispatch(setUserChannels(channels)))
      .then(dispatch(setUserDmRooms(dmRooms)))
      .then(() => setLoaded(true));
  }, [dispatch, user, workspaceId]);

  return (
    loaded && (
      <div id="workspace-main">
        <LeftSideBar workspace={workspace}></LeftSideBar>
        <MainContent></MainContent>
      </div>
    )
  );
};

export default OneWorkspace;
