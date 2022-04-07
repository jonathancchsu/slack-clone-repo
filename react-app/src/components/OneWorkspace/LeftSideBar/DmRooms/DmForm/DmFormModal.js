import React, { useState } from "react";
import { Modal } from "../../../../../context/Modal";

import DmRoomForm from ".";

const CreateDmModal = ({ socket }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>➕</button>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <DmRoomForm socket={socket} setShowModal={setShowModal}></DmRoomForm>
        </Modal>
      )}
    </>
  );
};

export default CreateDmModal;
