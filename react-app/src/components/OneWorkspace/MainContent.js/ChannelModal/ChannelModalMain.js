import React, { useState } from "react";
import { Modal } from "../../../../context/Modal";

import ChannelModal from ".";
import './ChannelModal.css'

const ChannelModalMain = (channel) => {
  const [showModal, setShowModal] = useState(false);

  return(
    <>
      <div onClick={() => setShowModal(true)} className='channel-name-modal'>
        <h1># {channel.channel.name}</h1>
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
