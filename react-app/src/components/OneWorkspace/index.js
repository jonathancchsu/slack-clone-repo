import "./OneWorkspace.css";

import { getOneWorkspace } from "../../store/workspace";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MainContent from "./MainContent.js";
import { setUserChannels } from "../../store/channel";
import { setUserDmRooms } from "../../store/dmRooms";

const OneWorkspace = () => {
  let { workspaceId } = useParams();
  console.log("right fucking hereeeeeeeeeeeeee", workspaceId);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.currentWorkspace);
  const userChannels = useSelector((state) => state.channels.userChannels);
  const user = useSelector((state) => state.session.user);
  //   console.log(workspace);
  useEffect(() => {
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
      <div>
        <LeftSideBar workspace={workspace}></LeftSideBar>
        <MainContent></MainContent>
        <RightSideBar></RightSideBar>
      </div>
    )
  );
};

export default OneWorkspace;
