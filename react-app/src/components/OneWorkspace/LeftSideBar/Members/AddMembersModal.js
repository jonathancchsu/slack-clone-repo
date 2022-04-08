import './Members.css';

import { addAMember } from "../../../../store/workspace";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

function AddMembersModal({ workspace, members, users, setShowModal }) {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('');
    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState([])
    const [query, setQuery] = useState(' ');



    useEffect(() => {
        let find = users?.filter(user => user.username.toLowerCase().includes(query.toLowerCase()))

        setResults(find);
    }, [query, users]);

    const selectMember = (user) => {
        setUserId(user.id);
        setQuery(user.username);
    }

    const addMember = e => {
        e.preventDefault();
        setErrors([])
        const user_exists = members.find(member => member.user_id === Number(userId));
        if (!user_exists) {
            dispatch(addAMember(Number(userId), workspace.id));
            setQuery(' ');
            setShowModal(false);
        }
        else setErrors(['User is already a member!'])
    }

    return (
        <div id='add-members-modal'>
            <h3>{`Add members to ${workspace.name}`}</h3>
            <form onSubmit={addMember}>
                <input type='text' placeholder='username' value={query} onChange={e => setQuery(e.target.value)} onClick={() => setQuery('')}></input>
                <div>
                    {errors?.map(error => (
                        <div key={error} style={{ color: 'red' }}>{error}</div>
                    ))}
                    {results?.map(user => (
                        <div className='results-map' key={`user:${user.id}`} onClick={() => selectMember(user)}>{user.username}</div>
                    ))}
                </div>
                <button className='add-member'>Add</button>
            </form>
        </div>
    );
}

export default AddMembersModal;
