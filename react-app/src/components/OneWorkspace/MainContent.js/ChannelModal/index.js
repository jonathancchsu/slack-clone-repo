import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { addNewChannelMember } from "../../../../store/channel";

import "./ChannelModal.css";

const ChannelModal = ({ setShowModal, channel }) => {
  const dispatch = useDispatch();
  const channelOwner = useSelector((state) => state.session.user.username);
  const [newMember, setNewMember] = useState("");

  const handleAddMember = (e, id) => {
    e.preventDefault();
    dispatch(addNewChannelMember(id, newMember));
    setNewMember("");
    setShowModal(false);
  }

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
          <p>{channelOwner}</p>
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