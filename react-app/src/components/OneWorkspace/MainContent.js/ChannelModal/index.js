import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannel, putChannel, addNewChannelMember } from "../../../../store/channel";
import { getAllUsers } from "../../../../store/session";

import "./ChannelModal.css";

const ChannelModal = ({ setShowModal, channel }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector ((state) => state.session.users);
  const [loaded, setLoaded] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [editName, setEditName] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [channelName, setChannelName] = useState(channel.name);
  const [channelTopic, setChannelTopic] = useState(channel.topic);
  const [channelDescription, setChannelDescription] = useState(channel.description);

  const ownername = allUsers.filter(user => user.id === channel.owner_id)[0].username

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setLoaded(true);
  }, [dispatch, user, allUsers, channel]);

  const handleAddMember = (e, id) => {
    e.preventDefault();
    dispatch(addNewChannelMember(id, newMember));
    setNewMember("");
    setShowModal(false);
  }

  const handleEditName = e => {
    e.preventDefault();
    dispatch(putChannel({ id: editName, description: channelDescription, topic: channelTopic, name: channelName }));
    setEditName("");
    setChannelName("");
  };

  const handleEditTopic = e => {
    e.preventDefault();
    dispatch(putChannel({ id: editTopic, description: channelDescription, topic: channelTopic, name: channelName }));
    setEditTopic("");
    setChannelTopic("");
  };

  const handleEditDescription = e => {
    e.preventDefault();
    dispatch(putChannel({ id: editDescription, description: channelDescription, topic: channelTopic, name: channelName }));
    setEditDescription("");
    setChannelDescription("");
  };

  const deleteEvent = (e, id) => {
    e.preventDefault();
    dispatch(deleteChannel(id));
  };

  return (
    loaded && (
      <div className="channel-modal-container">
        <div className="sub-container">
          {editName === channel.channel_id ? (
            <div>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                ></input>
              <button onClick={handleEditName}>Save</button>
              <button onClick={() => setEditName("")}>Cancel</button>
            </div>
          ) : (
            <div className="title-container">
              <b>#{channel.name}</b>
              {user.id === channel.owner_id &&
                <div onClick={(e) => setEditName(channel.id)}>
                  Edit
                </div>
              }
            </div>
          )}

        </div>
        <div className="sub-container">
          <b>Topic</b>
          {editTopic === channel.channel_id ? (
            <div>
              <input
                type="text"
                value={channelTopic}
                onChange={(e) => setChannelTopic(e.target.value)}
                ></input>
              <button onClick={handleEditTopic}>Save</button>
              <button onClick={() => setEditTopic("")}>Cancel</button>
            </div>
          ) : (
            <div className="title-container">
              <p>{channel.topic}</p>
              {user.id === channel.owner_id &&
                <div onClick={(e) => setEditTopic(channel.id)}>
                  Edit
                </div>
              }
            </div>
          )}

        </div>
        <div className="sub-container">
          <b>Description</b>
          {editDescription === channel.channel_id ? (
            <div>
              <input
                type="text"
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                ></input>
              <button onClick={handleEditDescription}>Save</button>
              <button onClick={() => setEditDescription("")}>Cancel</button>
            </div>
          ) : (
            <div className="title-container">
              <p>{channel.description}</p>
              {user.id === channel.owner_id &&
                <div className="" onClick={(e) => setEditDescription(channel.id)}>
                  Edit
                </div>
              }
            </div>
          )}
        </div>
        <div className="subcontainer">
          <b>Created By</b>
          <p>{ownername}</p>
        </div>
        <div className="subcontainer">
          <form onSubmit={(e) => handleAddMember(e, channel.id)}>
            <input
              type='text'
              value={newMember}
              onChange={e => setNewMember(e.target.value)}
            ></input>
            <button>add member</button>
          </form>
        </div>
        {user.id === channel.owner_id &&
          <button onClick={(e) => deleteEvent(e, channel.id)}>
            delete channel
          </button>
        }
      </div>
    )
  )
}

export default ChannelModal;
