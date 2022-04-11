import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannel, putChannel, addNewChannelMember } from "../../../../store/channel";
import { getCurrentChannel } from "../../../../store/currentView";
import { getAllUsers } from "../../../../store/session";
import { useHistory, useParams } from "react-router-dom";

import "./ChannelModal.css";

const ChannelModal = ({ setShowModal, channel, setMessages }) => {
  const dispatch = useDispatch();
  const {workspaceId} = useParams();
  let history = useHistory();
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
    dispatch(addNewChannelMember(id, newMember)).then(() => dispatch(getCurrentChannel(id)));
    setNewMember("");
    setShowModal(false);
  }

  const handleEditName = e => {
    e.preventDefault();
    dispatch(putChannel({ id: channel.id, description: channelDescription, topic: channelTopic, name: channelName }));
    dispatch(getCurrentChannel(channel.id))
    setEditName("");
    setChannelName("");
    setShowModal(false);
  };

  const handleEditTopic = e => {
    e.preventDefault();
    dispatch(putChannel({ id: channel.id, description: channelDescription, topic: channelTopic, name: channelName }));
    dispatch(getCurrentChannel(channel.id))
    setEditTopic("");
    setChannelTopic("");
    setShowModal(false);
  };

  const handleEditDescription = e => {
    e.preventDefault();
    dispatch(putChannel({ id: channel.id, description: channelDescription, topic: channelTopic, name: channelName }));
    dispatch(getCurrentChannel(channel.id))
    setEditDescription("");
    setChannelDescription("");
    setShowModal(false);
  };

  const deleteEvent = (e, id) => {
    e.preventDefault();
    dispatch(deleteChannel(id));
    setShowModal(false);
    setMessages([])
    history.push(`/workspaces/${workspaceId}`)
  };

  return (
    loaded && (
      <div className="channel-modal-container">
        <div><i className="fas fa-list" id="icon"></i></div>
        <div className="sub-container space">
          {editName === channel.id ? (
            <div className="title-container">
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                ></input>
              <button className="edit-btn smallstyle-btn" onClick={handleEditName}>Save</button>
              <button className="edit-btn smallstyle-btn" onClick={() => setEditName("")}>Cancel</button>
            </div>
          ) : (
            <div className="title-container">
              <div className="text-edit">
              <div className="text title">#{channel.name}</div>
              {user.id === channel.owner_id &&
                <div className="edit-btn" onClick={(e) => setEditName(channel.id)}>
                  Edit
                </div>
              }
              </div>
            </div>
          )}

        </div>
        <div className="sub-container space">
          <b>Topic</b>
          {editTopic === channel.id ? (
            <div className="title-container">
              <input
                type="text"
                value={channelTopic}
                onChange={(e) => setChannelTopic(e.target.value)}
                ></input>
              <button className="edit-btn smallstyle-btn" onClick={handleEditTopic}>Save</button>
              <button className="edit-btn smallstyle-btn" onClick={() => setEditTopic("")}>Cancel</button>
            </div>
          ) : (
            <div className="title-container">
              <div className="text">{channel.topic}</div>
              {user.id === channel.owner_id &&
                <div className="edit-btn" onClick={(e) => setEditTopic(channel.id)}>
                  Edit
                </div>
              }
            </div>
          )}

        </div>
        <div className="sub-container space">
          <b>Description</b>
          {editDescription === channel.id ? (
            <div className="title-container">
              <input
                type="text"
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                ></input>
              <button className="edit-btn smallstyle-btn" onClick={handleEditDescription}>Save</button>
              <button className="edit-btn smallstyle-btn" onClick={() => setEditDescription("")}>Cancel</button>
            </div>
          ) : (
            <div className="title-container">
              <div className="text">{channel.description}</div>
              {user.id === channel.owner_id &&
                <div className="edit-btn" onClick={(e) => setEditDescription(channel.id)}>
                  Edit
                </div>
              }
            </div>
          )}
        </div>
        <div className="subcontainer">
          <b>Created By</b>
          <div className="text">{ownername}</div>
        </div>
        <div className="subcontainer">
          <form className="input" onSubmit={(e) => handleAddMember(e, channel.id)}>
            <input
              type='text'
              value={newMember}
              onChange={e => setNewMember(e.target.value)}
              placeholder="member username"
            ></input>
            <button className="add-member-btn style-btn">add member</button>
          </form>
        </div>
        {user.id === channel.owner_id &&
          <button className="delete-btn style-btn" onClick={(e) => deleteEvent(e, channel.id)}>
            delete channel
          </button>
        }
      </div>
    )
  )
}

export default ChannelModal;
