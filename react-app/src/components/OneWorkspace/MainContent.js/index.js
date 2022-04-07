import "./MainContent.css";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactHtmlParser from "react-html-parser";

import {
  getCurrentChannel,
  getCurrentRoom,
  postChannelMessage,
  postDirectMessage,
  putMessage,
  deleteMessage,
} from "../../../store/currentView";
import { io } from "socket.io-client";
let socket;

const MainContent = () => {
  const [loaded, setloaded] = useState(false);
  const dispatch = useDispatch();
  let url = window.location.href;
  const [dmRoom, setDmRoom] = useState();
  const [channelRoom, setChannelRoom] = useState();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [edit, setEdit] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [socketChat, setSocketChat] = useState();
  const user = useSelector((state) => state.session.user);
  const view = useSelector((state) => state.currentView.main_content);

  const [showButtons, setShowButtons] = useState(null);

  useEffect(() => {
    setloaded(false);
    let id = url.split("/")[7] * 1;
    if (url.includes("channels")) {
      setDmRoom(false);
      setChannelRoom(true);
      dispatch(getCurrentChannel(id));
    } else {
      setChannelRoom(false);
      setDmRoom(true);
      dispatch(getCurrentRoom(id));
    }

    socket = io();
    socket.on("chat", (chat) => {
      if (chat.edit) {
        setSocketChat((socketChat) =>
          socketChat.messages.map((message) =>
            chat.id === message.id ? chat : message
          )
        );
      } else if (chat.delete) {
        setSocketChat((socketChat) =>
          socketChat.messages.filter((message) => chat.id !== message.id)
        );
      } else {
        setSocketChat(
          (socketChat) => (socketChat.messages = [...socketChat.messages, chat])
        );
      }
    });

    // when component unmounts, disconnect
    return () => {
      socket.disconnect();
    };
  }, [dispatch, url]);

  useEffect(() => {
    setMessages(view.messages);
    if (dmRoom) {
      setSocketChat({ dm_room_id: view.id, messages: view.messages });
    }
    if (channelRoom) {
      setSocketChat({ channel_id: view.id, messages: view.messages });
    }
    setloaded(true);
  }, [view, dmRoom, channelRoom]);

  const sendChat = async (e) => {
    e.preventDefault();

    dmRoom
      ? await dispatch(
          postDirectMessage({
            room_id: view.id,
            sender_id: user.id,
            content: chatInput,
          })
        ).then((message) =>
          socket.emit("chat", {
            id: message.id,
            room_id: view.id,
            sender_id: user.id,
            content: chatInput,
            sender_username: user.username,
            sender_profile_picture: user.profile_picture,
            created_at: message.created_at,
            socket: true,
          })
        )
      : await dispatch(
          postChannelMessage({
            channel_id: view.id,
            sender_id: user.id,
            content: chatInput,
          })
        ).then((message) =>
          socket.emit("chat", {
            id: message.id,
            channel_id: view.id,
            sender_id: user.id,
            content: chatInput,
            sender_username: user.username,
            sender_profile_picture: user.profile_picture,
            created_at: message.created_at,
            socket: true,
          })
        );
    setChatInput("");
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
    socket.emit("chat", {
      id: message.id,
      channel_id: view.id,
      sender_id: user.id,
      content: editContent,
      sender_username: user.username,
      sender_profile_picture: user.profile_picture,
      created_at: message.created_at,
      socket: message.socket,
      edit: true,
    });
    await dispatch(putMessage(message));
    setEdit(null);
    setEditContent("");
  };

  const handleDeleteMessage = async (e, message) => {
    e.preventDefault();
    socket.emit("chat", {
      id: message.id,
      channel_id: view.id,
      sender_id: user.id,
      content: editContent,
      sender_username: user.username,
      sender_profile_picture: user.profile_picture,
      created_at: message.created_at,
      delete: true,
    });
    await dispatch(deleteMessage(message));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEdit(null);
    setEditContent("");
  };

  return (
    loaded && (
      <div id="main-content">
        <div>
          <div id="main-header">
            <div style={{ marginLeft: 5 }}>
              {channelRoom && <h2>#{view?.name}</h2>}
            </div>
            <div className="main-header-members">
              members:{view.members?.length}
            </div>
          </div>
          <div>
            {dmRoom && (
              <h2>{view.members?.map((member) => member.username)}</h2>
            )}
          </div>
        </div>
        <div id="chat-container">
          {messages?.map((message, idx) =>
            // TO EDIT
            edit === message.id ? (
              <div key={message.id} className="edit-message">
                <img src={message.sender_profile_picture} alt=""></img>
                <div className="editor">
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
              <div
                className="single-msg"
                key={message.id}
                onMouseEnter={() => setShowButtons(idx)}
              >
                <div className="sender-pic">
                  <img src={message.sender_profile_picture} alt="profile" />
                </div>
                <div className="sender-content">
                  <div className="sender-name">
                    <h4>{message.sender_username}</h4>
                    <p style={{ fontSize: 10, marginLeft: 5 }}>
                      {message.created_at.split(" ")[4].slice(0, 5)} PM
                    </p>
                  </div>
                  <div className="sender-msg">
                    {ReactHtmlParser(message.content)}
                  </div>
                </div>
                {user.id === message.sender_id && showButtons === idx && (
                  <span className="edit-delete">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditContent(message.content);
                        setEdit(message.id);
                      }}
                    >
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
                  "codeBlock",
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
