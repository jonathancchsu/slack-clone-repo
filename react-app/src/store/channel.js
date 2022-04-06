import { csrfFetch } from "./csrf";
//add, edit, delete

//--------------------------------------------set channels-----------------------
const SET_USER_CHANNELS = "channels/SetUserChannels";
export const setUserChannels = (channels) => {
  return { type: SET_USER_CHANNELS, channels };
};
//------------------------------------add channel---------------------------------
const ADD_CHANNEL = "Channels/AddChannel";
export const addChannel = (channel) => ({
  type: ADD_CHANNEL,
  channel,
});

export const postChannel = (channel) => async (dispatch) => {
  const res = await csrfFetch("/api/channels/new", {
    method: "POST",
    body: JSON.stringify(channel),
  });
  const new_channel = await res.json();

  dispatch(addChannel(new_channel));
};

//------------------------------------edit channel---------------------------------
const UPDATE_CHANNEL = "channels/UpdateChannel";
export const updateChannel = (channel) => ({
  type: UPDATE_CHANNEL,
  channel,
});

export const putChannel = (channel) => async (dispatch) => {
  const res = await csrfFetch(`api/channels/${channel.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });
  const updatedChannel = await res.json();
  dispatch(updateChannel(updatedChannel));
};

//------------------------------------delete channel---------------------------------
const DELETE_CHANNEL = "channels/deleteChannel";
export const removeChannel = (channel_id) => ({
  type: DELETE_CHANNEL,
  channel_id,
});
export const deleteChannel = (channel_id) => async (dispatch) => {
  const res = await csrfFetch(`api/channels/${channel_id}`, {
    method: "DELETE",
  });
  const channelNum = await res.json();

  dispatch(removeChannel(channelNum));
};

//-----------------------------------channel reducer---------------------------------
const channelReducer = (
  state = { currentChannel: {}, currentView: {}, userChannels: {} },
  action
) => {
  let newState = { ...state };

  switch (action.type) {
    case SET_USER_CHANNELS: {
      newState.userChannels = action.channels;
      return newState;
    }
    case ADD_CHANNEL: {
      newState.userChannels[action.channel.id] = { ...action.channel };

      return newState;
    }
    case UPDATE_CHANNEL: {
      newState.userChannels[action.channel.id] = action.channel;

      return newState;
    }
    case DELETE_CHANNEL: {
      delete newState.userChannels[action.channel_id];
      return newState;
    }
    default:
      return state;
  }
};

export default channelReducer;
