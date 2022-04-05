import "./AllWorkspaces.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUser } from "../../store/session";
import { useDispatch } from "react-redux";
import { deleteEvent, putWorkspace } from "../../store/workspace";


const Workspaces = ({ userId }) => {
  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  let history = useHistory();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch()
  // })

  const redirect = (workspaceId) => {
    history.push(`/workspaces/${workspaceId}`);
  };

  const createForm = () => {
    history.push("/workspaces/new");
  };

  const handleEdit = async (e, workspace) => {
    e.preventDefault()
    workspace.name = workspaceName
    await dispatch(putWorkspace(workspace))
    setEdit('');
    setWorkspaceName('');
    return dispatch(getUser(userId)).then(() => setLoaded(true));
  }

  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(getUser(userId)).then(() => setLoaded(true));
  }, [userId, dispatch]);

  const deleteWorkspace = (id) => {
    dispatch(deleteEvent(id));
    dispatch(getUser(userId)).then(() => setLoaded(true));
  }

  return (
    loaded && (
      <div>
        <h1>👋 Welcome back</h1>

        {user.workspace_member.map((workspace) => (
          <div key={workspace.id}>
            <h2>{workspace.name}</h2>
            <h3>{workspace.members_length} members</h3>
            <button onClick={(e) => redirect(workspace.id)}>
              Launch Workspace
            </button>
            <button onClick={() => deleteWorkspace(workspace.id)}>DELETE</button>
            <button onClick={() => setEdit(workspace.id)}>EDIT</button>
            {edit === workspace.id? <div>
              <input type='text'
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              ></input>
              <button onClick={(e) => handleEdit(e, workspace)}>Save</button>
              <button onClick={() => setEdit('')}>Cancel</button>
              </div>: <></>}
            <div></div>
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
    )
  );
};

export default Workspaces;
