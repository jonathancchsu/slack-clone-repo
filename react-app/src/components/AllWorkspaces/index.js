import "./AllWorkspaces.css";
import { useHistory } from "react-router-dom";

const Workspaces = ({ user }) => {
  let history = useHistory();
  const redirect = (workspaceId) => {
    history.push(`/workspaces/${workspaceId}`);
  };
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
    </div>
  );
};

export default Workspaces;
