import "./AllWorkspaces.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUser } from "../../store/session";
import { useDispatch } from "react-redux";
import { deleteEvent, putWorkspace } from "../../store/workspace";
import { setUserWorkspaces } from "../../store/workspace";
import { logout } from "../../store/session";

const Workspaces = ({ userId }) => {
  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  let history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const workspace = useSelector((state) => state.workspace);
  const workspacesObj = workspace.userWorkspaces;
  const workspaces = Object.values(workspacesObj);

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(setUserWorkspaces(user.workspace_member));
    setLoaded(true);
  }, [dispatch, user, userId]);

  const redirect = (workspaceId) => {
    history.push(`/workspaces/${workspaceId}`);
  };

  const createForm = () => {
    history.push("/workspaces/new");
  };

  const handleEditing = (e, workspaceId) => {
    e.preventDefault();
    setEdit(workspaceId);
  };
  const handleEdit = async (e, workspace, workspaceName) => {
    e.preventDefault();
    workspace.name = workspaceName;
    await dispatch(putWorkspace(workspace))
      .then(() => setEdit(""))
      .then(() => setWorkspaceName(""));
  };

  const deleteWorkspace = (id) => {
    dispatch(deleteEvent(id));
  };

  const onLogout = async (e) => {
    await dispatch(logout());
  };

  return (
    loaded && (
      <div className="workspaces-container">
        <div className="main-nav">
          <div className="main-logo">
            <img src="/static/icon.png" alt="logo" style={{ height: 30 }} />
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
            <img
              src="/static/waving-hand.gif"
              alt="wave"
              style={{ height: 40 }}
            />
            <h1>Welcome back</h1>
          </div>
          <div key={workspace.id} className="workspace-box">
            <div className="main-user">Workspaces for {user.email}</div>
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="workspace-content">
                <div className="workspace-name">
                  <div className="team">
                    <img
                      src="/static/icon.png"
                      alt="icon"
                      style={{ height: 40, marginLeft: 10 }}
                    />
                    <div className="workspace-info">
                      <h2>{workspace.name}</h2>
                      <p>{workspace.members_length} members</p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="launch-workspace"
                      onClick={(e) => redirect(workspace.id)}
                    >
                      LAUNCH SLACK
                    </button>
                  </div>
                </div>
                <div>
                  {user.workspaces_owned.includes(workspace.id) ? (
                    <div>
                      <div>
                        <div className="view-more">
                          <p>view more</p>
                          <i className="fas fa-chevron-down" />
                          <div className={`main-buttons`}>
                            <button
                              className="main-delete-btn"
                              onClick={() => deleteWorkspace(workspace.id)}
                            >
                              DELETE
                            </button>
                            <button
                              className="main-edit-btn"
                              onClick={(e) => handleEditing(e, workspace.id)}
                            >
                              EDIT
                            </button>
                            {edit === workspace.id ? (
                              <div>
                                <div className="edit-btns">
                                  <button
                                    className="main-save-btn"
                                    onClick={(e) =>
                                      handleEdit(e, workspace, workspaceName)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="main-cancel-btn"
                                    onClick={(e) => setEdit("")}
                                  >
                                    Cancel
                                  </button>
                                  <input
                                    type="text"
                                    value={workspaceName}
                                    onChange={(e) =>
                                      setWorkspaceName(e.target.value)
                                    }
                                    className="main-edit-field"
                                  ></input>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="create-wmn-ws">
            <img src="/static/create-ws.png" alt="wmn" />

            <h4>Want to use Slack with a different team?</h4>
            <button className="create-wmn-btn" onClick={(e) => createForm()}>
              CREATE A NEW WORKSPACE
            </button>
          </div>
          <div className="not-seeing-ws">
            Not seeing your workspace?
            <button onClick={onLogout} className="diff-email-btn">
              Try using a different email
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Workspaces;
