import { csrfFetch } from "./csrf";

//----------------------------------------------------------------load current view
const LOAD_CURRENTVIEW = "view/LoadCurrentView";

export const loadCurrentView = (view) => {
  return { type: LOAD_CURRENTVIEW, view };
};

export const getCurrentChannel = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/channels/${channelId}`);
  const channel = await res.json();
  dispatch(loadCurrentView(channel));
};
export const getCurrentRoom = (roomId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/dms/${roomId}`);
  const dm_room = await res.json();
  dispatch(loadCurrentView(dm_room));
};

const DELETE_MESSAGE = "view/deleteMessage";
export const removeMessage = (messageId) => ({
  type: DELETE_MESSAGE,
  messageId,
});
export const deleteMessage = (messageId) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/${messageId}`, {
    method: "DELETE",
  });

  const deletedMessage = await res.json();

  dispatch(removeMessage(deletedMessage));
};
//-------------------------------------- edit message
const UPDATE_MESSAGE = "view/UpdateMessage";
export const updateMessage = (message) => ({
  type: UPDATE_MESSAGE,
  message,
});
export const putMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/${message.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  const updatedMessage = await res.json();
  dispatch(updateMessage(updatedMessage));
};
//-----------------------------add channel message
export const postChannelMessage = (message) => async (dispatch) => {
  console.log(message);
  const res = await csrfFetch(`/api/messages/channels/${message.channel_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();
  return newMessage;
};
export const postDirectMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/dm_rooms/${message.dm_room_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();
  return newMessage;
};

//------------------------------------------- delete messages ------------------------------------------------------------------

const currentViewReducer = (state = {}, action) => {
  let newState = { ...state };

  switch (action.type) {
    case LOAD_CURRENTVIEW: {
      newState = action.view;
      return newState;
    }
    case UPDATE_MESSAGE: {
      newState.messages[action.message.id] = action.message;
      return newState;
    }
    case DELETE_MESSAGE: {
      delete newState.messages[action.messageId];
      return newState;
    }
    default:
      return state;
  }
};

export default currentViewReducer;
