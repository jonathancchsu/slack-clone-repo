import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postDmRoom } from "../../../../../store/dmRooms";
import { searchInWorkspace } from "../../../../../store/workspace";

import "./DmForm.css";

const DmRoomForm = ({ setShowModal }) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  // const users = useSelector((state) => state.session.users);
  const owner_id = useSelector((state) => state.session.user.id);
  const workspace_id = useSelector(
    (state) => state.workspace.currentWorkspace.id
  );
  const [members, setMembers] = useState([user]);
  const dispatch = useDispatch();

  const [inputField, setInputField] = useState("");
  
  const [allWorkspaceMembers, setAllWorkspaceMembers] = useState([])

  useEffect(() => {
    dispatch(searchInWorkspace({ workspace_id, parameters: 'people', keyword: inputField.length ? inputField : 'no_specific_member' })).then(result => setAllWorkspaceMembers(result.result));
  }, [dispatch, inputField, user.id, workspace_id]);


  const addMember = (new_member) => {
    let existingMember = members.find((member) => member.username === new_member.username);
    if (!existingMember) setMembers([...members, new_member]);
  };
  const removeMember = (memberId) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(postDmRoom({ owner_id, workspace_id, members: members })).then(
      (result) => {
        history.push(`/workspaces/${workspace_id}/dm_rooms/${result}`);
        setShowModal(false);
      }
    );
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
      
      <input type="text" defaultValue={inputField} onChange={e => setInputField(e.target.value)}/>
      <div id='results-field'>
        {
          allWorkspaceMembers.map(member => <div key={member.id}>
            <button onClick={() => addMember(member)}>{member.username}</button>
            </div>)
        }
      </div>
      <button type="submit" className="create-dm-btn" onClick={handleSubmit}>
        Create Direct Message
      </button>
    </div>
  );
};

export default DmRoomForm;
