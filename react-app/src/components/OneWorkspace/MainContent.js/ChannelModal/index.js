import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannel, putChannel, addNewChannelMember } from "../../../../store/channel";
import { getAllUsers } from "../../../../store/session";

import "./ChannelModal.css";

const ChannelModal = ({ setShowModal, channel }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const allUsers = useSelector ((state) => state.session.users)
  const [newMember, setNewMember] = useState("");
  const [edit, setEdit] = useState("");
  const [channelName, setChannelName] = useState(channel.name);
  const [channelTopic, setChannelTopic] = useState(channel.topic);
  const [channelDescription, setChannelDescription] = useState(channel.description);

  const ownername = allUsers.filter(user => user.id === channel.owner_id)[0].username

  const handleAddMember = (e, id) => {
    e.preventDefault();
    dispatch(addNewChannelMember(id, newMember));
    setNewMember("");
    setShowModal(false);
  }

  const handleEdit = e => {
    e.preventDefault();
    dispatch(putChannel({ id: edit, description: channelDescription, topic: channelTopic, name: channelName }));
    setEdit("");
    setChannelName("");
    setChannelTopic("");
    setChannelDescription("");
  };

  const deleteEvent = (e, id) => {
    e.preventDefault();
    dispatch(deleteChannel(id));
  };

  return (
      <div className="channel-modal-container">
        <div className="sub-container">
          <b>Topic</b>
          <p>{channel.topic}</p>
        </div>
        <div className="sub-container">
          <b>Description</b>
          <p>{channel.description}</p>
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
      </div>
  )
}

export default ChannelModal;
