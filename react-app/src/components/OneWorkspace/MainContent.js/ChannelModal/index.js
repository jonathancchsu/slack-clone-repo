import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./ChannelModal.css";

const ChannelModal = ({ setShowModal }) => {
  const channelName = useSelector()
  const channelTopic = useSelector()
  const channelDescription = useSelector()
  const channelOwner = useSelector()
  const createdAt = useSelector()

  return (
      <div className="channel-modal-container">
        <h1>{channelName}</h1>
        <span>X</span>
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
      </div>
  )
}

export default ChannelModal;
