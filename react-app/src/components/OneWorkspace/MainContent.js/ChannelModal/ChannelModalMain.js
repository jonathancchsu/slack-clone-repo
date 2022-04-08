import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "../../../../context/Modal";

import ChannelModal from ".";
import './ChannelModal.css'

const ChannelModalMain = () => {
  const [showModal, setShowModal] = useState(false);
  const channelsObj = useSelector((state) => state.channels);
  const userChannels = Object.values(channelsObj.userChannels);
  const channelId = Number(window.location.href.split('/')[6])
  const channelobj = userChannels.filter(channel => channel.channel_id === channelId)
  const channel = channelobj[0].channel_data

  return(
    <>
      <div onClick={(e) => setShowModal(true)} className='channel-name-modal'>
        <div className="channel-name-tag">
          <h1 className="channelname"># {channel.name}</h1><i className="fas fa-chevron-down"></i>
        </div>
      </div>
      {showModal && (
        <Modal className="modal" onClose={() => setShowModal(false)}>
          <ChannelModal setShowModal={setShowModal} channel={channel}></ChannelModal>
        </Modal>
      )}
    </>
  );
};

export default ChannelModalMain;
