import React, { useState } from "react";
import { Modal } from "../../../../context/Modal";

import ChannelModal from ".";

const ChannelModalMain = (channelName) => {
  const [showModal, setShowModal] = useState(false);

  return(
    <>
      <div onClick={() => setShowModal(true)} className='channel-name-modal'>
        <h1>{channelName}</h1>
      </div>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <ChannelModal setShowModal={setShowModal}></ChannelModal>
        </Modal>
      )}
    </>
  )
}
