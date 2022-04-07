import { useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannel, putChannel, addNewChannelMember } from "../../../../store/channel";
import CreateChannelModal from "../ChannelForm/CreateChannelModal";
import "./channels.css";

const Channels = ({ workspace }) => {
  const dispatch = useDispatch();
  let history = useHistory();

  const user = useSelector((state) => state.session.user);
  const channelsObj = useSelector((state) => state.channels);
  const userChannels = Object.values(channelsObj.userChannels);
  useEffect(() => {
    setLoaded(true);
  }, [dispatch, channelsObj, user]);

  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelTopic, setChannelTopic] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  const [showChannels, setShowChannels] = useState(false);
  const [newMember, setNewMember] = useState("");
  const channelRoom = (id) => {
    history.push(`/workspaces/${workspace.id}/messages/channels/${id}`);
  };

  const handleEdit = e => {
    e.preventDefault();
    dispatch(putChannel({ id: edit, description: channelDescription, topic: channelTopic, name: channelName }));
    setEdit("");
    setChannelName("");
    setChannelTopic("");
    setChannelDescription("");
  };

  const deleteEvent = (e, id) => {
    e.preventDefault();
    dispatch(deleteChannel(id));
  };

  const handleAddMember = (e, id) => {
    e.preventDefault();
    dispatch(addNewChannelMember(id, newMember))
    setNewMember("");
  }

  return (
    loaded && (
      <div id='channels-tab-main'>
        <span id='channels-tab-child'>
          <button onClick={() => setShowChannels(!showChannels)}><i className="fas fa-caret-right"></i></button>
          <p>Channels</p>
          <CreateChannelModal></CreateChannelModal>
        </span>
        { showChannels && userChannels.map((channel) => (
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
                <form onSubmit={(e) => handleAddMember(e, channel.channel_id)}>
                  <input type='text' value={newMember} onChange={e => setNewMember(e.target.value)}></input>
                  <button>add member</button>
                </form>
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
      </div>
    )
  );
};

export default Channels;
