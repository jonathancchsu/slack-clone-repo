import './Members.css';

import { useState } from "react";
import { Modal } from '../../../../context/Modal';
import AddMembersModal from './AddMembersModal';

function Members({ workspace, user, members }) {
  const [showMembers, setShowMembers] = useState(false);
  const [showModal, setShowModal] = useState(false);

    return (
        <div id='members-main'>
          <span id='members-tab'>
            <button onClick={() => setShowMembers(!showMembers)}><i className="fas fa-caret-right"></i></button>
            <p>Members</p>
            <button onClick={() => setShowModal(true)}><i className="fas fa-plus"></i></button>
          </span>
          <div id='members-list'>
            {showMembers && workspace.members.map((member) => (
              <p key={member.id.toString()}>{member.username}</p>
            ))}
          </div>
          {
            showModal &&
            <Modal onClose={() => setShowModal(false)}>
              <AddMembersModal workspace={workspace} user={user} members={members}/>
            </Modal>
          }
        </div>
    );
}

export default Members;
