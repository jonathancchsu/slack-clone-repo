import { useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../../../store/session";
import { deleteChannel, putChannel } from "../../../../store/channel";

import "./channels.css"


const Channels = ({ workspace, users, user_id }) => {
  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelTopic, setChannelTopic] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const dispatch = useDispatch();
  let history = useHistory();


  const channelMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };

  const createChannelForm = () => {
    history.push("/channels/new")
  }

  const handleEdit = (e, channel) => {
    e.preventDefault();
    channel.name = channelName;
    channel.topic = channelTopic;
    channel.description = channelDescription;
    dispatch(putChannel(channel))
    setEdit('');
    setChannelName('');
    setChannelTopic('');
    setChannelDescription('');
    dispatch(getUser(user_id).then(() => setLoaded(true)));
  };

  const deleteEvent = (id) => {
    dispatch(deleteChannel(id)
              .then(() => dispatch(getUser(user_id)
              .then(() => setLoaded(true))))
    );
  };

  useEffect(() => {
    dispatch(getUser(user_id)).then(() => setLoaded(true));
  }, [user_id, dispatch]);

  return (
    loaded && (
    <div>
      <h3>Channels</h3>
      {workspace.channels.map((channel) => (
        <div key={channel.id}>
          <div onClick={() => channelMessages(channel.id)}>
            # {channel.name}
          </div>
          <button onClick={() =>deleteEvent(channel.id)}>delete channel</button>
          <button onClick={() => setEdit(channel.id)}>edit channel</button>
          {edit === channel.id ? <div>
            <input type='text'
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
            ></input>
            <input type='text'
                value={channelTopic}
                onChange={(e) => setChannelTopic(e.target.value)}
            ></input>
            <input type='text'
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
            ></input>
            <button onClick={(e) => handleEdit(e, channel)}>Save</button>
            <button onClick={() => setEdit('')}>Cancel</button>
            </div> : <></>}
        </div>
      ))}
      <div className="create-channel">
        <button className="create-btn" onClick={(e) => createChannelForm()}>
          Add New Channel
        </button>
      </div>
    </div>
    )
  );
};

export default Channels;
