import { useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../../../store/session";
import { deleteChannel, putChannel } from "../../../../store/channel";

import "./channels.css"


const Channels = ({ workspace, users }) => {
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

  const createChannelForm = (channel_id) => {
    history.push(`/workspaces/${channel_id}`)
  }

  return (
    <div>
      <h3>Channels</h3>
      {workspace.channels.map((channel) => (
        <div onClick={() => channelMessages(channel.id)} key={channel.id}>
          # {channel.name}
        </div>
      ))}
    </div>
  );
};

export default Channels;
