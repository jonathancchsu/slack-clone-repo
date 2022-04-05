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
    dispatch(getUser(userId)).then(() => setLoaded(true));
  }

  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(getUser(userId)).then(() => setLoaded(true));
  }, [userId, dispatch]);

  const deleteWorkspace = (id) => {
    dispatch(deleteEvent(id)).then(() => dispatch(getUser(userId)).then(() => setLoaded(true)))

  }

  return (
    loaded && (
      <div className="workspaces-container">
        <div className="main-nav">
          <div className="main-logo">
            <img src='./images/icon.png' style={{ height: 30 }} />
            slack
          </div>
          <div className="create-workspace">
            <button className="create-btn" onClick={(e) => createForm()}>
              CREATE A NEW WORKSPACE
            </button>
          </div>
        </div>
        <div className="workspaces">
          <div className="main-head">
            <img src='./images/waving-hand.gif' style={{ height: 40 }} />
            <h1>Welcome back</h1>
          </div>
          {user.workspace_member.map((workspace) => (
            <div key={workspace.id} className='workspace-box'>
              <div className="main-user">Workspaces for {user.email}</div>
              <div className="workspace-name">
                <div className="workspace-info">
                  <h2>{workspace.name}</h2>
                  <p>{workspace.members_length} members</p>
                </div>
                <div>
                  <button className='launch-workspace' onClick={(e) => redirect(workspace.id)}>
                    Launch Workspace
                  </button>
                </div>
              </div>
              <div className="main-buttons">
                <button className='main-delete-btn' onClick={() => deleteWorkspace(workspace.id)}>DELETE</button>
                <button className='main-edit-btn' onClick={() => setEdit(workspace.id)}>EDIT</button>
                {edit === workspace.id ? <div>
                  <input type='text'
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  ></input>
                  <button onClick={(e) => handleEdit(e, workspace)}>Save</button>
                  <button onClick={() => setEdit('')}>Cancel</button>
                </div> : <></>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Workspaces;
