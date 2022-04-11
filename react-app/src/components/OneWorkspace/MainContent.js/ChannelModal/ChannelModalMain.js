import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../../../../context/Modal";
import { addNewChannelMember } from "../../../../store/channel";
import { getCurrentChannel } from "../../../../store/currentView";

import ChannelModal from ".";
import './ChannelModal.css'

const ChannelModalMain = ({setMessages}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const channel = useSelector(state => state.currentView.main_content);
  const userChannels = useSelector(state => state.channels.userChannels);
  const view = useSelector((state) => state.currentView.main_content);
  const user = useSelector((state) => state.session.user);

  return(
    <>
      <div onClick={(e) => setShowModal(true)} className='channel-name-modal'>
        <div className="channel-name-tag">
          <h1 className="channelname"># {channel?.name}</h1>
          <i className="fas fa-chevron-down"></i>
          <p>{channel?.topic}</p>
          {(userChannels[view.id] === undefined && view.channel_id !== undefined) ? <button id='join-channel' onClick={e => {
            e.stopPropagation();
            dispatch(addNewChannelMember(channel.id, user.username)).then(() => {
              dispatch(getCurrentChannel(channel.id))});
          }}>Join Channel</button> : null}
        </div>
      </div>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <ChannelModal setShowModal={setShowModal} channel={channel} setMessages={setMessages}></ChannelModal>
        </Modal>
      )}
    </>
  );
};

export default ChannelModalMain;
