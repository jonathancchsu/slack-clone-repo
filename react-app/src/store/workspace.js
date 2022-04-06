import { csrfFetch } from "./csrf";

//--------------------------------------------load workspaces-----------------------
const SET_USER_WORKSPACES = "workspaces/SetUserWorkspaces";
export const setUserWorkspaces = (workspaces) => {
  return { type: SET_USER_WORKSPACES, workspaces };
};
//--------------------------------------------load workspaces-----------------------
const LOAD_WORKSPACES = "workspaces/LoadWorkspaces";
export const loadWorkspaces = (workspaces) => {
  return { type: LOAD_WORKSPACES, workspaces };
};

//-------------------------------------------get one workspace------------------------
const SET_WORKSPACE = "workspaces/SetWorkspace";
export const loadOneWorkspace = (workspace) => {
  return { type: SET_WORKSPACE, workspace };
};

export const getOneWorkspace = (workspaceId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/${workspaceId}`);
  const workspace = await res.json();
  dispatch(loadOneWorkspace(workspace));
};

//-------------------------------------------add Workspace member
const ADD_MEMBER = "workspaces/AddMember";
const addMember = (member) => {
  return { type: ADD_MEMBER, member };
};

export const addAMember = (user_id, workspace_id) => async (dispatch) => {
  console.log("in store....", user_id, workspace_id);
  const res = await csrfFetch(
    `/api/workspaces/users/${workspace_id}/${user_id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user_id, workspace_id),
    }
  );

  const member = await res.json();
  dispatch(addMember(member));
};

//--------------------------------------------get current view------------------------
// const LOAD_CURRENTVIEW = "workspaces/LoadCurrentView";

// export const loadCurrentView = (view) => {
//   return { type: LOAD_CURRENTVIEW, view };
// };

// export const getCurrentChannel = (channelId) => async (dispatch) => {
//   const res = await fetch(`/api/workspaces/channels/${channelId}`);
//   const channel = await res.json();
//   dispatch(loadCurrentView(channel));
// };
// export const getCurrentRoom = (roomId) => async (dispatch) => {
//   const res = await fetch(`/api/workspaces/dms/${roomId}`);
//   const dm_room = await res.json();
//   dispatch(loadCurrentView(dm_room));
// };

//--------------------------------------------add workspace-----------------------

const ADD_WORKSPACE = "workspaces/AddWorkspace";
export const addWorkspace = (workspace) => ({
  type: ADD_WORKSPACE,
  workspace,
});

export const postWorkspace = (workspace) => async (dispatch) => {
  const res = await csrfFetch("/api/workspaces/new", {
    method: "POST",
    body: JSON.stringify(workspace),
  });
  const new_workspace = await res.json();
  // console.log("new workspace+++++++++++++++++++++++",new_workspace)
  dispatch(addWorkspace(new_workspace));
};
//--------------------------------------------update workspace-----------------------
const UPDATE_WORKSPACE = "workspaces/UpdateWorkspace";
export const updateWorkspace = (workspace) => ({
  type: UPDATE_WORKSPACE,
  workspace,
});
export const putWorkspace = (workspace) => async (dispatch) => {
  const res = await csrfFetch(`/api/workspaces/${workspace.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });
  const updatedWorkspace = await res.json();
  dispatch(updateWorkspace(updatedWorkspace));
};

//--------------------------------------------delete workspace-----------------------
const DELETE_WORKSPACE = "workspaces/deleteWorkspace";
export const removeEvent = (workspaceId) => ({
  type: DELETE_WORKSPACE,
  workspaceId,
});
export const deleteEvent = (workspaceId) => async (dispatch) => {
  const res = await csrfFetch(`/api/workspaces/${workspaceId}`, {
    method: "DELETE",
  });

  const workspaceNum = await res.json();

  dispatch(removeEvent(workspaceNum));
};
//---------------------------------------------reducer----------------------------

const workspaceReducer = (
  state = { currentWorkspace: {}, currentView: {}, userWorkspaces: {} },
  action
) => {
  let newState = { ...state };

  switch (action.type) {
    case SET_USER_WORKSPACES: {
      action.workspaces.forEach(
        (workspace) => (newState.userWorkspaces[workspace.id] = workspace)
      );
      return newState;
    }
    case ADD_WORKSPACE: {
      newState.userWorkspaces[action.workspace.id] = { ...action.workspace };

      return newState;
    }
    case UPDATE_WORKSPACE: {
      newState.userWorkspaces[action.workspace.id] = { ...action.workspace };
      return newState;
    }
    case DELETE_WORKSPACE: {
      delete newState.userWorkspaces[action.workspaceId.workspace_id];
      return newState;
    }
    case SET_WORKSPACE: {
      newState.currentWorkspace = action.workspace;
      return newState;
    }
    case ADD_MEMBER: {
      return newState;
    }
    default:
      return state;
  }
};

export default workspaceReducer;
