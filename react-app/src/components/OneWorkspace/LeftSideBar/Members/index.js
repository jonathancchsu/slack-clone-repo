import "./Members.css";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "../../../../context/Modal";
import AddMembersModal from "./AddMembersModal";

function Members({ workspace, user, members }) {
  const [showMembers, setShowMembers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const users = useSelector((state) => state.session.users);

  return (
    <div id="members-main">
      <span id="members-tab">
        <div className="title_drop_down">
          <button className="dots" onClick={() => setShowMembers(!showMembers)}>
            <i className="fas fa-ellipsis-v"></i>
          </button>
          <p>Members</p>
        </div>
        <button
          className="add-ws-members-btn"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus-square fa-lg"></i>
        </button>
      </span>
      <div id="members-list">
        {showMembers &&
          workspace.members.map((member) => (
            <p key={member.id.toString()}>{member.username}</p>
          ))}
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddMembersModal
            workspace={workspace}
            user={user}
            members={members}
            users={users}
            setShowModal={setShowModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default Members;
