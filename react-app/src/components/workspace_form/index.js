import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { postWorkspace } from '../../store/workspace';
import './workspace_form.css'

const WorkspaceForm = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState('');
  // const [owner_id, setId] = useState(1);
  const dispatch = useDispatch();
  let history = useHistory();
  const owner_id = useSelector(state => state.session.user.id)

  const onCreate = async (e) => {
    e.preventDefault();
    // console.log(name)
    if (name.length >= 1) {
      const data = await dispatch(postWorkspace({name, owner_id}));
      // console.log(data)
      if (data) {
        setErrors(data)
      }
    }
    return history.push('/');
  }

  const updateName = (e) => {
    setName(e.target.value);
  }

  // const updateId = (e) => {
  //   setId(e.target.value);
  // }

  return (
    <div className='create-workspace-container'>
      <h1>Create Your workspace</h1>
      <form onSubmit={onCreate} className='create-workspace-form'>
        <div className='errors-container'>
        {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <input
            type='text'
            name='name'
            onChange={updateName}
            value={name}
            required={true}
            placeholder='Workspace Name'
          ></input>
          {/* <input
          value={owner_id}
          name='owner_id'
          onChange={updateId}
          ></input> */}
        </div>
        <button type='submit' className='create-workspace-btn'>Create Workspace</button>
      </form>
    </div>
  )
}

export default WorkspaceForm;
