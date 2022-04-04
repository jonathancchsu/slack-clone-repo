import { csrfFetch } from "./csrf";

//load messages
//post message
//edit message
//delete message
// //--------------------------------------------load channel messages-----------------------
// const LOAD_CHANNELMESSAGES = "messages/LoadChannelMessages";
// export const loadChannelMessages = (messages) => {
//   return { type: LOAD_CHANNELMESSAGES, messages };
// };

// export const getChannelMessages = (channelId) => async (dispatch) => {
//   const res = await fetch(`/api/messages/channels/${channelId}`);
//   const getMessages = await res.json();
//   dispatch(loadChannelMessages(getMessages));
// };

// //--------------------------------------------load direct messages-----------------------
// const LOAD_DIRECTMESSAGES = "messages/LoadDirectMessages";
// export const loadDirectMessages = (messages) => {
//   return { type: LOAD_DIRECTMESSAGES, messages };
// };

// export const getDirectMessages = (dmRoomId) => async (dispatch) => {
//   const res = await fetch(`/api/messages/dm_rooms/${dmRoomId}`);
//   const getMessages = await res.json();
//   dispatch(loadDirectMessages(getMessages));
// };

//--------------------------------------------load channel messages-----------------------
const LOAD_MESSAGES = "messages/LoadMessages";
export const loadMessages = (messages) => {
  return { type: LOAD_MESSAGES, messages };
};

export const getChannelMessages = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/messages/channels/${channelId}`);
  const getMessages = await res.json();
  dispatch(loadMessages(getMessages));
};

//--------------------------------------------load direct messages-----------------------
// const LOAD_DIRECTMESSAGES = "messages/LoadDirectMessages";
// export const loadDirectMessages = (messages) => {
//   return { type: LOAD_DIRECTMESSAGES, messages };
// };

export const getDirectMessages = (dmRoomId) => async (dispatch) => {
  const res = await fetch(`/api/messages/dm_rooms/${dmRoomId}`);
  const getMessages = await res.json();
  dispatch(loadMessages(getMessages));
};

//--------------------------------------------add channel message-----------------------

const ADD_CHANNELMESSAGE = "messages/AddChannelMessage";
export const addChannelMessage = (message) => ({
  type: ADD_CHANNELMESSAGE,
  message,
});

export const postChannelMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/channels/${message.channel_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();

  dispatch(addChannelMessage(newMessage));
};

//--------------------------------------------add direct message-----------------------

const ADD_DIRECTMESSAGE = "messages/AddDirectMessage";
export const addDirectMessage = (message) => ({
  type: ADD_DIRECTMESSAGE,
  message,
});

export const postDirectMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/dm_rooms/${message.dm_room_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();

  dispatch(addDirectMessage(newMessage));
};

//--------------------------------------------update message-----------------------
const UPDATE_MESSAGE = "messages/UpdateMessage";
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

//--------------------------------------------delete message-----------------------
const DELETE_MESSAGE = "messages/deleteMessage";
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
//---------------------------------------------reducer----------------------------

const messageReducer = (state = {}, action) => {
  let newState = { ...state };

  switch (action.type) {
    // case LOAD_CHANNELMESSAGES: {
    //   action.message.forEach((message) => {
    //     return (newState[message.id] = message);
    //   });
    //   return newState;
    // }
    // case LOAD_DIRECTMESSAGES: {
    //   action.message.forEach((message) => {
    //     return (newState[message.id] = message);
    //   });
    //   return newState;
    // }
    //-------------------------------------testing

    case LOAD_MESSAGES: {
      action.messages.messages.forEach((message) => {
        return (newState[message.id] = message);
      });
      return newState;
    }

    //-------------------------------------testing
    case ADD_CHANNELMESSAGE: {
      newState[action.message.id] = { ...action.message };

      return newState;
    }
    case ADD_DIRECTMESSAGE: {
      newState[action.message.id] = { ...action.message };

      return newState;
    }
    case UPDATE_MESSAGE: {
      newState[action.message.id] = action.message;
      return newState;
    }
    case DELETE_MESSAGE: {
      delete newState[action.messageId];
      return newState;
    }
    default:
      return state;
  }
};

export default messageReducer;
