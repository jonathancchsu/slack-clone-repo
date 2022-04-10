import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postDmRoom } from "../../../../../store/dmRooms";
import { searchInWorkspace } from "../../../../../store/workspace";

import "./DmForm.css";

const DmRoomForm = ({ setShowModal }) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
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
    <div id="create-dm-container">
      <div id='members-added'>
        To:
        {members?.map((member) =>
        (
          member.id !== user.id && <div className="added-member" key={member.id}>
            <img src={member.profile_picture} alt=''></img>
            <div>{member.username}</div>
            {user.username !== member.username && (
              // <div onClick={() => removeMember(member.id)}>❌</div>
              <i className="fas fa-times" onClick={() => removeMember(member.id)}></i>
            )}
          </div>
        ))}
        <input placeholder={members.length === 1 ? "@someone" : ""} type="text" defaultValue={inputField} onChange={e => setInputField(e.target.value)}/>
      </div>
      
      <div id='results-field'>
        {
          allWorkspaceMembers.map(member => <div key={member.id}>
            <button className="add-member-button" onClick={() => addMember(member)}>
              <img src={member.profile_picture} alt=''></img>
              {member.username}
              </button>
            </div>)
        }
      </div>
      <button disabled={members.length === 1} className={members.length > 1 ? "can-add" : "cannot-add"} type="submit" id="create-dm-button" onClick={handleSubmit}>
        Create Direct Message
      </button>
    </div>
  );
};

export default DmRoomForm;
