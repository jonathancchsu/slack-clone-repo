import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postChannel } from "../../../../store/channel";

import "./ChannelForm.css";

const ChannelForm = ({ setShowModal }) => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const owner_id = useSelector((state) => state.session.user.id);
  const workspace_id = useSelector(
    (state) => state.workspace.currentWorkspace.id
  );

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateTopic = (e) => {
    setTopic(e.target.value);
  };

  const updateDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length >= 1 && topic.length >= 1 && description.length >= 1) {
      const data = dispatch(
        postChannel({ name, topic, description, owner_id, workspace_id })
      );
      if (data) {
        setErrors(data);
      }
      setShowModal(false);
    }
  };

  return (
    <div className="create-channel-container">
      {errors.length > 0 && (
        <div className="errors-container">
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
      )}
      <div>
        <input
          type="text"
          name="name"
          onChange={updateName}
          value={name}
          required={true}
          placeholder="Channel Name"
        ></input>
      </div>
      <div>
        <input
          type="text"
          name="topic"
          onChange={updateTopic}
          value={topic}
          required={true}
          placeholder="Channel Topic"
        ></input>
      </div>
      <div>
        <input
          type="text"
          name="description"
          onChange={updateDescription}
          value={description}
          required={true}
          placeholder="Channel Description"
        ></input>
      </div>
      <button
        type="submit"
        className="create-channel-btn"
        onClick={handleSubmit}
      >
        Create Channel
      </button>
    </div>
  );
};

export default ChannelForm;
