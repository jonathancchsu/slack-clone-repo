import "./MainContent.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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
  const user = useSelector((state) => state.session.user);
  const view = useSelector((state) => state.currentView);
  useEffect(() => {
    let id = url.split("/")[7] * 1;
    if (url.includes("channels")) {
      setDmRoom(false);
      setChannelRoom(true);
      dispatch(getCurrentChannel(id)).then(() => setloaded(true));
    } else {
      setChannelRoom(false);
      setDmRoom(true);
      dispatch(getCurrentRoom(id)).then(() => setloaded(true));
    }

    socket = io();

    socket.on("chat", (chat) => {
      setMessages((messages) => [...messages, chat]);
    });
    // when component unmounts, disconnect
    return () => {
      socket.disconnect();
    };
  }, [dispatch, url]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value);
  };

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
            user: user.username,
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
            user: user.username,
            created_at: message.created_at,
            socket: true,
          })
        );
    setChatInput("");
  };

  const handleEditMessage = async (e, message) => {
    e.preventDefault();
    message.content = editContent;
    await dispatch(putMessage(message));
    setEdit(null);
    setEditContent("");
  };

  const handleDeleteMessage = async (e, message) => {
    e.preventDefault();
    await dispatch(deleteMessage(message));
    if (message.socket)
      setMessages(messages.filter((msg) => msg.id !== message.id));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEdit(null);
    setEditContent("");
  };

  return (
    loaded && (
      <div>
        <div>
          <div>{channelRoom && <h2>{view.topic}</h2>}</div>
          <div>
            {dmRoom && <h2>{view.members.map((member) => member.username)}</h2>}
          </div>
          <div>insert member icon {view.members.length}</div>
        </div>
        {view.messages.map((message) =>
          edit === message.id ? (
            <div key={message.id}>
              {message.sender_username}
              <input
                type="text"
                defaultValue={message.content}
                onChange={(e) => setEditContent(e.target.value)}
              ></input>
              <button onClick={(e) => handleEditMessage(e, message)}>
                Submit
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <div key={message.id}>
              {message.sender_username}:{message.content}
              {message.created_at}
              {user.id === message.sender_id && (
                <span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEdit(message.id);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={(e) => handleDeleteMessage(e, message)}>
                    Delete
                  </button>
                </span>
              )}
            </div>
          )
        )}
        <div>
          {messages.map((message, ind) =>
            edit === message.id ? (
              <div key={message.id}>
                {message.sender_username}
                <input
                  type="text"
                  defaultValue={message.content}
                  onChange={(e) => setEditContent(e.target.value)}
                ></input>
                <button onClick={(e) => handleEditMessage(e, message)}>
                  Submit
                </button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <div key={ind}>
                {`${message.user}: ${message.content} ${message.created_at}`}
                {user.id === message.sender_id && (
                  <span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();

                        setEdit(message.id);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={(e) => handleDeleteMessage(e, message)}>
                      Delete
                    </button>
                  </span>
                )}
              </div>
            )
          )}
        </div>
        <form onSubmit={sendChat}>
          <input value={chatInput} onChange={updateChatInput} />
          <button type="submit">Send</button>
        </form>
      </div>
    )
  );
};

export default MainContent;
