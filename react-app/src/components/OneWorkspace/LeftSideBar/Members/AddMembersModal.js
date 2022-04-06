import './Members.css';

import { addAMember } from "../../../../store/workspace";
import { useState } from 'react';
import { useDispatch } from 'react-redux';

function AddMembersModal({ workspace, members }) {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('');

    const addMember = e => {
        e.preventDefault();
        const user_exists = members.find(member => member.user_id === Number(userId));
        if (!user_exists) dispatch(addAMember(Number(userId), workspace.id));
        else console.log('error expected :)')
    }

    return (
        <div id='add-members-modal'>
            <form onSubmit={addMember}>
                <input type='text' placeholder='userId' value={userId} onChange={e => setUserId(e.target.value)}></input>
                <button>Add</button>
            </form>
        </div>
    );
}

export default AddMembersModal;
