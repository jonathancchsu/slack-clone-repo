import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postDmRoom } from "../../../../../store/dmRooms";

import "./DmForm.css";

const DmRoomForm = ({ setShowModal }) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.session.users);
  const owner_id = useSelector((state) => state.session.user.id);
  const workspace_id = useSelector(
    (state) => state.workspace.currentWorkspace.id
  );
  const [members, setMembers] = useState([user]);
  const dispatch = useDispatch();

  const addMember = (username) => {
    const member = users.find((user) => user.username === username);
    let existingMember = members.find((member) => member.username === username);
    if (!existingMember && member) setMembers([...members, member]);
  };
  const removeMember = (memberId) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(members)

    dispatch(postDmRoom({ owner_id, workspace_id, members: members })).then(result => {
      history.push(`/workspaces/${workspace_id}/messages/dm_rooms/${result}`);
      setShowModal(false);
    });

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addMember(e.target.value);
    }
  };

  return (
    <div className="create-dm-container">
      <div>
        Members Added :
        {members?.map((member) => (
          <div key={member.id}>
            <div>{member.username}</div>
            {user.username !== member.username && (
              <div onClick={() => removeMember(member.id)}>❌</div>
            )}
          </div>
        ))}
      </div>
      <input type="text" list="users" onKeyPress={(e) => handleKeyPress(e)} />
      <datalist id="users" className="users_datalist">
        {users?.map(
          (opUser) =>
            user.username !== opUser.username && (
              <option
                value={opUser.username}
                key={opUser.id}
                onClick={() => addMember(opUser)}
              >
                {opUser.username}
              </option>
            )
        )}
      </datalist>

      <button type="submit" className="create-dm-btn" onClick={handleSubmit}>
        Create Direct Message
      </button>
    </div>
  );
};

export default DmRoomForm;
