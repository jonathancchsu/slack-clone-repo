import { useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannel, putChannel } from "../../../../store/channel";
import CreateChannelModal from "../ChannelForm/CreateChannelModal";
import "./channels.css";

const Channels = ({ workspace, user_id }) => {
  const dispatch = useDispatch();
  let history = useHistory();

  const user = useSelector((state) => state.session.user);
  const channelsObj = useSelector((state) => state.channels);
  const userChannels = Object.values(channelsObj.userChannels);
  console.log("right hereeeeeeeeeeeeeeeeeeeeeeeee", userChannels);
  useEffect(() => {
    setLoaded(true);
  }, [dispatch, channelsObj, user]);

  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelTopic, setChannelTopic] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  const channelRoom = (id) => {
    console.log("hereeeeeeeeeeeeeeeeeeeeee right", id);
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };

  const handleEdit = e => {
    e.preventDefault();
    // channel.name = channelName;
    // channel.topic = channelTopic;
    // channel.description = channelDescription;
    dispatch(putChannel({ id: edit, description: channelDescription, topic: channelTopic, name: channelName }));
    // console.log({ id: edit, description: channelDescription, topic: channelTopic, name: channelName });
    setEdit("");
    setChannelName("");
    setChannelTopic("");
    setChannelDescription("");
  };

  const deleteEvent = (e, id) => {
    e.preventDefault();
    dispatch(deleteChannel(id));
  };
  return (
    loaded && (
      <div>
        <h3>Channels</h3>
        <CreateChannelModal></CreateChannelModal>
        {userChannels.map((channel) => (
          <div key={channel.channel_id}>
            <div onClick={() => channelRoom(channel.channel_id)}>
              # {channel.channel_data.name}
            </div>
            {user.id === channel.channel_data.owner_id && (
              <>
                <button onClick={(e) => deleteEvent(e, channel.channel_id)}>
                  delete channel
                </button>
                <button onClick={(e) => setEdit(channel.channel_id)}>
                  edit channel
                </button>
              </>
            )}
            {edit === channel.channel_id ? (
              <div>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                ></input>
                <input
                  type="text"
                  value={channelTopic}
                  onChange={(e) => setChannelTopic(e.target.value)}
                ></input>
                <input
                  type="text"
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                ></input>
                <button onClick={handleEdit}>Save</button>
                <button onClick={() => setEdit("")}>Cancel</button>
              </div>
            ) : (
              <></>
            )}
          </div>
        ))}
        <div className="create-channel"></div>
      </div>
    )
  );
};

export default Channels;
