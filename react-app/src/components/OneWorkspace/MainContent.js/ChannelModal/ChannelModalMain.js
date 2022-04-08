import React, { useState } from "react";
import { Modal } from "../../../../context/Modal";

import ChannelModal from ".";
import './ChannelModal.css'

const ChannelModalMain = (channel) => {
  const [showModal, setShowModal] = useState(false);

  return(
    <>
      <div onClick={() => setShowModal(true)} className='channel-name-modal'>
        <div className="channel-name-tag">
          <h1 className="channelname"># {channel.channel.name}</h1><i className="fas fa-chevron-down"></i>
        </div>
      </div>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <ChannelModal setShowModal={setShowModal} channel={channel.channel}></ChannelModal>
        </Modal>
      )}
    </>
  );
};

export default ChannelModalMain;
