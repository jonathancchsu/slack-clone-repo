import { csrfFetch } from "./csrf";
//add, edit, delete

//--------------------------------------------set dmrooms-----------------------
const SET_USER_DM_ROOMS = "dm_rooms/SetUserDmRooms";
export const setUserDmRooms = (dmRooms) => {
  return { type: SET_USER_DM_ROOMS, dmRooms };
};
//------------------------------------add dmroom---------------------------------
const ADD_DM_ROOM = "dm_rooms/AddDmRoom";
export const addDmRoom = (dmRoom) => ({
  type: ADD_DM_ROOM,
  dmRoom,
});

export const postDmRoom = (dmRoom) => async (dispatch) => {
  const res = await csrfFetch("/api/dm_rooms/", {
    method: "POST",
    body: JSON.stringify(dmRoom),
  });
  const dm = await res.json();

  dispatch(addDmRoom(dm));
};

//------------------------------------edit dmroom---------------------------------
const UPDATE_DM_ROOM = "dm_rooms/UpdateDm_room";
export const updateChannel = (dmRoom) => ({
  type: UPDATE_DM_ROOM,
  dmRoom,
});

export const putDmRoom = (dmRoom) => async (dispatch) => {
  const res = await csrfFetch(`api/dm_rooms/${dmRoom.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dmRoom),
  });
  const updatedDmRoom = await res.json();
  dispatch(updateChannel(updatedDmRoom));
};

//------------------------------------delete dmroom---------------------------------
const DELETE_DM_ROOM = "dm_rooms/delete_Dm_Room";
export const removeDmRoom = (roomId) => ({
  type: DELETE_DM_ROOM,
  roomId,
});
export const deleteDmRoom = (roomId) => async (dispatch) => {
  const res = await csrfFetch(`api/dm_rooms/${roomId}`, {
    method: "DELETE",
  });
  const dmRoomId = await res.json();

  dispatch(removeDmRoom(dmRoomId));
};

//-----------------------------------dmroom reducer---------------------------------
const dmRoomReducer = (
  state = { currentDmRoom: {}, userDmRooms: {} },
  action
) => {
  let newState = { ...state };

  switch (action.type) {
    case SET_USER_DM_ROOMS: {
      action.dmRooms.forEach(
        (dm) => (newState.userDmRooms[dm.dm_room_id] = dm)
      );
      return newState;
    }
    case ADD_DM_ROOM: {
      newState.userDmRooms[action.dmRoom.id] = { ...action.dmRoom };

      return newState;
    }
    case UPDATE_DM_ROOM: {
      newState.userDmRooms[action.dmRoom.id] = action.dmRoom;

      return newState;
    }
    case DELETE_DM_ROOM: {
      delete newState.userDmRooms[action.dm_room_id];
      return newState;
    }
    default:
      return state;
  }
};

export default dmRoomReducer;
