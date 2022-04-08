import { csrfFetch } from "./csrf";

//----------------------------------------------------------------load current view
const LOAD_MAINCONTENT = "view/LoadCurrentView";

export const loadMainContent = (view) => {
  return { type: LOAD_MAINCONTENT, view };
};

export const getCurrentChannel = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/channels/${channelId}`);
  const channel = await res.json();
  channel["channel_id"] = channel.id;
  dispatch(loadMainContent(channel));
};

export const getCurrentRoom = (roomId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/dms/${roomId}`);
  const dm_room = await res.json();
  dm_room["dm_room_id"] = dm_room.id;
  dispatch(loadMainContent(dm_room));
};

//-----------------------------------------------------delete message
const DELETE_MESSAGE = "view/deleteMessage";
export const removeMessage = (message) => ({
  type: DELETE_MESSAGE,
  message,
});
export const deleteMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/${message.id}`, {
    method: "DELETE",
  });
  const deletedMessage = await res.json();
  if (!message.socket) dispatch(removeMessage(deletedMessage));
  return deleteMessage;
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
  if (!message.socket) dispatch(updateMessage(updatedMessage));
  let socketMessage = {
    channel_id: updatedMessage.channel_id,
    dm_room_id: updateMessage.room_id,
  };
  socketMessage[updateMessage.id] = updateMessage;
  return socketMessage;
};
//-----------------------------add channel message
export const postChannelMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/channels/${message.channel_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();
  let socketMessage = {
    id: newMessage.id,
    channel_id: newMessage.channel_id,
    dm_room_id: newMessage.room_id,
    content: newMessage.content,
    created_at: newMessage.created_at,
    room: message.room,
    sender_username: message.sender_username,
    sender_profile_picture: message.sender_profile_picture,
  };

  return socketMessage;
};
export const postDirectMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/dm_rooms/${message.room_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();
  let socketMessage = {
    id: newMessage.id,
    dm_room_id: newMessage.room_id,
    channel_id: newMessage.channel_id,
    content: message.content,
    created_at: newMessage.created_at,
    room: message.room,
    sender_username: message.sender_username,
    sender_profile_picture: message.sender_profile_picture,
  };
  return socketMessage;
};
//----------------------------------------------set channels
const SET_CHANNELS = "view/LoadChannels";

export const setChannels = (channels) => {
  return { type: SET_CHANNELS, channels };
};

//----------------------------------------------set dm rooms
const SET_DM_ROOMS = "view/LoadDmRooms";

export const setDmRooms = (dm_rooms) => {
  return { type: SET_DM_ROOMS, dm_rooms };
};

//------------------------------------------- delete messages ------------------------------------------------------------------

const currentViewReducer = (
  state = { main_content: {}, channels: {}, dm_rooms: {} },
  action
) => {
  let newState = { ...state };

  switch (action.type) {
    case SET_CHANNELS: {
      newState.channels = action.channels;
      return newState;
    }
    case SET_DM_ROOMS: {
      newState.dm_rooms = action.dm_rooms;
      return newState;
    }
    case LOAD_MAINCONTENT: {
      newState.main_content = action.view;

      return newState;
    }
    case UPDATE_MESSAGE: {
      newState.main_content.messages = newState.main_content.messages.map(
        (message) =>
          action.message.id === message.id ? action.message : message
      );
      return newState;
    }
    case DELETE_MESSAGE: {
      // delete newState.messages[action.messageId];
      newState.main_content.messages = newState.main_content.messages.filter(
        (message) => action.message.message_id !== message.id
      );
      return newState;
    }
    default:
      return state;
  }
};

export default currentViewReducer;
