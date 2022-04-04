import { csrfFetch } from "./csrf";
//--------------------------------------------load workspaces-----------------------
const LOAD_WORKSPACES = "workspaces/LoadWorkspaces";
export const loadWorkspaces = (workspaces) => {
  return { type: LOAD_WORKSPACES, workspaces };
};

export const getWorkspaces = (userId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/${userId}`);
  const workspaces = await res.json();
  dispatch(loadWorkspaces(workspaces));
};
//-------------------------------------------get one workspace------------------------
const LOAD_ONEWORKSPACE = "workspaces/LoadOneWorkspace";
export const loadOneWorkspace = (workspace) => {
  return { type: LOAD_ONEWORKSPACE, workspace };
};

export const getOneWorkspace = (workspaceId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/${workspaceId}`);
  const workspace = await res.json();
  dispatch(loadOneWorkspace(workspace));
};

//--------------------------------------------get current view------------------------
// const LOAD_CURRENTVIEW = 'workspaces/LoadCurrentView'

// export const loadCurrentView = (object) => {
//   return {type:LOAD_CURRENTVIEW, object }
// }

// export const getChannelMessages

//--------------------------------------------add workspace-----------------------

const ADD_WORKSPACE = "workspaces/AddWorkspace";
export const addWorkspace = (workspace) => ({
  type: ADD_WORKSPACE,
  workspace,
});

export const postWorkspace = (workspace) => async (dispatch) => {
  const res = await csrfFetch("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(workspace),
  });
  const new_workspace = await res.json();

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
  state = { currentWorkspace: {}, currentView: {} },
  action
) => {
  let newState = { ...state };

  switch (action.type) {
    case LOAD_WORKSPACES: {
      action.workspaces.forEach((workspace) => {
        return (newState[workspace.id] = workspace);
      });
      return newState;
    }
    case ADD_WORKSPACE: {
      newState[action.workspace.id] = { ...action.workspace };

      return newState;
    }
    case UPDATE_WORKSPACE: {
      newState[action.workspace.id] = action.workspace;
      return newState;
    }
    case DELETE_WORKSPACE: {
      delete newState[action.workspaceId];
      return newState;
    }
    case LOAD_ONEWORKSPACE: {
      newState.currentWorkspace = action.workspace;
      return newState;
    }
    default:
      return state;
  }
};

export default workspaceReducer;
