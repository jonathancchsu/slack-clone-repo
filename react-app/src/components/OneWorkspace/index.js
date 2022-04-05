import "./OneWorkspace.css";

import { getOneWorkspace } from "../../store/workspace";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MainContent from "./MainContent.js";

const OneWorkspace = () => {
  let { workspaceId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.currentWorkspace);
  //   console.log(workspace);
  useEffect(() => {
    dispatch(getOneWorkspace(workspaceId)).then(() => setLoaded(true));
  }, [dispatch, workspaceId]);

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
