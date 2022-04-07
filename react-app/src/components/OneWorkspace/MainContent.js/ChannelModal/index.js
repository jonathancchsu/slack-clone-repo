import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { addNewChannelMember } from "../../../../store/channel";

import "./ChannelModal.css";

const ChannelModal = ({ setShowModal }) => {
  const dispatch = useDispatch()
  const { channelId } = window.location.href.split('/')[7]

  const [newMember, setNewMember] = useState("");

  const handleAddMember = (e, id) => {
    e.preventDefault();
    dispatch(addNewChannelMember(id, newMember))
    setNewMember("");
  }

  return (
      <div className="channel-modal-container">
        <h1>{channelName}</h1>
        <div className="sub-container">
          <b>Topic</b>
          <p>{channelTopic}</p>
        </div>
        <div className="sub-container">
          <b>Description</b>
          <p>{channelDescription}</p>
        </div>
        <div className="subcontainer">
          <b>Created By</b>
          <p>{channelOwner} on {createdAt}</p>
        </div>
        <div className="subcontainer">
          <form onSubmit={(e) => handleAddMember(e, channelId)}>
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
