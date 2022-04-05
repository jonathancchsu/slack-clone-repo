import { useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


import "./channels.css"


const Channels = ({ workspace, users }) => {
  let history = useHistory();
  const channelMessages = async (id) => {
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };

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
