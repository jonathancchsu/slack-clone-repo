import React, { useState } from "react";
import { Modal } from "../../../../context/Modal";

import ChannelForm from ".";

const CreateChannelModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>➕</button>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <ChannelForm setShowModal={setShowModal}></ChannelForm>
        </Modal>
      )}
    </>
  );
};

export default CreateChannelModal;
