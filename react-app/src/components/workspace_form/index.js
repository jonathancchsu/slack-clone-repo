import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postWorkspace } from "../../store/workspace";
import "./workspace_form.css";

const WorkspaceForm = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  let history = useHistory();
  const owner_id = useSelector((state) => state.session.user.id);
  const onCreate = async (e) => {
    e.preventDefault();
    if (name.length >= 1) {
      const data = await dispatch(postWorkspace({ name, owner_id }));
      if (data) {
        setErrors(data);
      }
    }
    return history.push("/");
  };

  const updateName = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="create-workspace-container">
      <div className="create-top-bar">
        <a href='/' style={{ fontSize: 25, display: 'flex', alignItems: 'center' }}><img src='/static/icon.png' style={{ height: 30 }} alt='icon' />slack</a>
      </div>
      <div className="create-box">
        <h1>What's the name of your company or team?</h1>
        <p>This will be the name of your Slack workspace - choose something that your team will recognize.</p>
        <form onSubmit={onCreate} className="create-workspace-form">
          <div className="errors-container">
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
            <input
              type="text"
              name="name"
              onChange={updateName}
              value={name}
              required={true}
              className="create-ws"
              placeholder="  Ex: App Academy or Bootcamp"
            ></input>
          </div>
          <button type="submit" className="create-workspace-btn">
            Create Workspace
          </button>
        </form>
        <div className="create-ws-cancel-btn">
          <a style={{ textDecoration: 'none', fontSize: 12 }} href='/'>cancel</a>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceForm;
