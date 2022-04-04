import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { postWorkspace, putWorkspace } from '../../store/workspace';
import './workspace_form.css'

const WorkspaceForm = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const onCreate = async (e) => {
    e.preventDefault();
    if (name.length >= 1) {
      const data = await dispatch(postWorkspace(name));
    }
  }

  const onEdit = async (e) => {
    e.preventDefault();
    if (name.length >= 1) {
      const data = await dispatch(putWorkspace(name));
    }
  }

  const updateName = (e) => {
    setName(e.target.value);
  }

  return (
    <div className='create-workspace-container'>
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
        </div>
        <button type='submit' className='create-workspace-btn'>Create</button>
      </form>
    </div>
  )
}

export default WorkspaceForm;
