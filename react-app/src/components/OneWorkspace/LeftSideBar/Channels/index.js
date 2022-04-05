import { useHistory } from "react-router-dom";
// import { useEffect, useState } from "react";
const Channels = ({ workspace, user }) => {
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
