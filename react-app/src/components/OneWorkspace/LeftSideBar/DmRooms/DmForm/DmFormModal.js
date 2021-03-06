import React, { useState } from "react";
import { Modal } from "../../../../../context/Modal";

import DmRoomForm from ".";

const CreateDmModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}><img style={{height: 30}} src='/static/edit-button.png' alt='dm-someone'/></button>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <DmRoomForm setShowModal={setShowModal}></DmRoomForm>
        </Modal>
      )}
    </>
  );
};

export default CreateDmModal;
