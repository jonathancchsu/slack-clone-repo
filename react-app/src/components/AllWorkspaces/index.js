import "./AllWorkspaces.css";
// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import { getWorkspaces } from "../../store/workspace";
// import WorkspaceForm from "../workspace_form";


const Workspaces = ({ user }) => {
  // const [load, setLoad] = useState();
  let history = useHistory();
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch()
  // })

  const redirect = (workspaceId) => {
    history.push(`/workspaces/${workspaceId}`);
  };

  const createForm = () => {
    history.push("/workspaces/new")
  }
  const workspaces = useSelector(state => state.workspace.userWorkspaces)
  console.log('workspaces here ========================',workspaces)
  return (
    <div>
      <h1>👋 Welcome back</h1>

      {user.workspace_member.map((workspace) => (
        <div key={workspace.id}>
          <h2>{workspace.name}</h2>
          <h3>{workspace.members_length} members</h3>
          <button onClick={(e) => redirect(workspace.id)}>
            Launch Workspace
          </button>
        </div>
      ))}
      {/* <div>
        <WorkspaceForm />
      </div> */}
      <div className="create-workspace">
        <button className="create-btn" onClick={(e) => createForm()}>
          Add New Workspace
        </button>
      </div>
    </div>
  );
};

export default Workspaces;
