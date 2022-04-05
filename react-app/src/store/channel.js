import { csrfFetch } from "./csrf";

//add, edit, delete

const ADD_CHANNEL = "Channels/AddChannel";
export const addChannel = (channel) => ({
  type: ADD_CHANNEL,
  channel,
});

export const postChannel = (channel) => async (dispatch) => {
  const res = await csrfFetch()
}
