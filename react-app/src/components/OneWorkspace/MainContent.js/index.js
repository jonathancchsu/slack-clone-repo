import "./MainContent.css";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";

import {
  getCurrentChannel,
  getCurrentRoom,
  postChannelMessage,
  postDirectMessage,
  putMessage,
  deleteMessage,
} from "../../../store/currentView";
import { io } from "socket.io-client";
import ChannelModalMain from "./ChannelModal/ChannelModalMain";
let socket;

const MainContent = () => {
  const { channelId, dmRoomId, workspaceId } = useParams();
  const [prevRoom, setPrevRoom] = useState(
    channelId ? `channel${channelId}` : `dmroom${dmRoomId}`
  );
  const [socketRoom, setSocketRoom] = useState();
  const dispatch = useDispatch();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [edit, setEdit] = useState(null);
  const [editContent, setEditContent] = useState("");

  const user = useSelector((state) => state.session.user);
  const view = useSelector((state) => state.currentView.main_content);
  const [showButtons, setShowButtons] = useState(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    if (channelId) {
      dispatch(getCurrentChannel(channelId));
      setSocketRoom(`channel${channelId}`);
    }

    if (dmRoomId) {
      dispatch(getCurrentRoom(dmRoomId));
      setSocketRoom(`dmroom${dmRoomId}`);
    }
  }, [dispatch, dmRoomId, channelId]);

  useEffect(() => {
    setMessages(view.messages);
  }, [view]);

  useEffect(() => {
    socket = io();
    socket.on("message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    leaveRoom(prevRoom);
    joinRoom(socketRoom);
    setPrevRoom(socketRoom);
  }, [prevRoom, socketRoom]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView();
  }, [messages])

  const leaveRoom = (oldRoom) => {
    socket.emit("leave_room", { room: oldRoom });
  };

  const joinRoom = (newRoom) => {
    socket.emit("join_room", { room: newRoom });
  };

  const sendChat = async (e) => {
    e.preventDefault();
    if (dmRoomId) {
      await dispatch(
        postDirectMessage({
          room_id: dmRoomId,
          channel_id: null,
          sender_id: user.id,
          content: chatInput,
          room: socketRoom,
          sender_username: user.username,
          sender_profile_picture: user.profile_picture,
        })
      ).then((message) => socket.send(message));
    }
    if (channelId) {
      await dispatch(
        postChannelMessage({
          channel_id: view.id,
          room_id: null,
          sender_id: user.id,
          content: chatInput,
          room: socketRoom,
          sender_username: user.username,
          sender_profile_picture: user.profile_picture,
        })
      ).then((message) => socket.send(message));
    }
    setChatInput("");
    let audio = new Audio("/static/knock_brush.mp3");
    audio.play();
    dispatch(getCurrentChannel(channelId))
  };

  const updateChatInput = (e, editor) => {
    const richText = editor.getData();
    setChatInput(richText);
  };

  const updateMessageContent = (e, editor) => {
    const richText = editor.getData();
    setEditContent(richText);
  };

  const handleEditMessage = async (e, message) => {
    e.preventDefault();
    message.content = editContent;
    socket.send({
      id: message.id,
      channel_id: view.id,
      sender_id: user.id,
      content: editContent,
      sender_username: user.username,
      sender_profile_picture: user.profile_picture,
      created_at: message.created_at,
      socket: message.socket,
      room: socketRoom,
      edit: true,
    });
    await dispatch(putMessage(message));
    setEdit(null);
    setEditContent("");
    setShowButtons(null);
  };

  const handleDeleteMessage = async (e, message) => {
    e.preventDefault();
    socket.on("chat", {
      id: message.id,
      channel_id: view.id,
      sender_id: user.id,
      content: editContent,
      sender_username: user.username,
      sender_profile_picture: user.profile_picture,
      created_at: message.created_at,
      room: socketRoom,
      delete: true,
    });
    await dispatch(deleteMessage(message));
    await dispatch(getCurrentChannel(channelId))
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEdit(null);
    setEditContent("");
    setShowButtons(null);
  };

  return (
    view.workspace_id === workspaceId * 1 && (
      <div id="main-content">
        <div>
          <div style={{ marginLeft: 20 }}>
            {channelId && <ChannelModalMain channel={view} setMessages={setMessages}></ChannelModalMain>}
          </div>
          <div id="main-header">
            <div></div>
            <div className="main-header-members">
              {view.members?.map((member, idx) => {
                return (
                  idx < 3 && (
                    <img
                      key={member.id}
                      className={`idx${idx}`}
                      src={member.profile_picture}
                      alt=""
                    ></img>
                  )
                );
              })}
              <p>{view.members?.length}</p>
            </div>
          </div>
          <div>
            {dmRoomId && (
              <div>
                <div className="dm-room-members">{view.members?.map((member) => (<div style={{ marginLeft: 5 }}>{member.username},</div>))}</div>
              </div>
            )}
          </div>
        </div>
        <div id="chat-container">
          {messages?.map((message, idx) =>
            // TO EDIT
            edit === message.id ? (
              <div key={message.id} className="edit-message">
                <img src={message.sender_profile_picture} alt=""></img>
                <div className="editor"
                     onMouseLeave={() => setShowButtons(null)}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    onChange={updateMessageContent}
                    data={message.content}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "indent",
                        "outdent",
                        "|",
                        "codeBlock",
                        "blockQuote",
                        "insertTable",
                        "undo",
                        "redo",
                      ],
                    }}
                  />
                </div>
                <span className="edit-box">
                  <button onClick={handleCancel}>Cancel</button>
                  <button onClick={(e) => handleEditMessage(e, message)}>
                    Save
                  </button>
                </span>
              </div>
            ) : (
              <div className="single-msg" key={message.id ? message.id : idx}>
                <div className="sender-pic">
                  <img src={message.sender_profile_picture} alt="profile" />
                </div>
                <div className="sender-content">
                  <div className="sender-name">
                    <h4>{message.sender_username}</h4>
                    <p style={{ fontSize: 10, marginLeft: 5 }}>
                      {message.created_at} PM
                    </p>
                  </div>
                  <div className="sender-msg" onClick={() => setShowButtons(idx)}>
                    {ReactHtmlParser(message.content)}
                  </div>
                </div>
                {user.id === message.sender_id && showButtons === idx && (
                  <span
                  className="edit-delete"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditContent(message.content);
                        setEdit(message.id);
                      }}>
                      <i className="far fa-edit"></i>
                    </button>
                    <button onClick={(e) => handleDeleteMessage(e, message)}>
                      <i className="far fa-trash-alt"></i>
                    </button>
                  </span>
                )}
              </div>
            )
          )}
          <div ref={messagesEnd}></div>
        </div>
        <div className="chat-box">
          <form onSubmit={sendChat}>
            <CKEditor
              editor={ClassicEditor}
              onChange={updateChatInput}
              data={chatInput}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "indent",
                  "outdent",
                  "|",
                  "blockQuote",
                  "insertTable",
                  "undo",
                  "redo",
                ],
              }}
            />
            <button
              className={`send-btn ${!chatInput.length}`}
              type="submit"
              disabled={!chatInput.length}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default MainContent;
