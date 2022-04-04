import "./MainContent.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import { getChannelMessages, getDirectMessages } from "../../../store/message";
import { getCurrentChannel, getCurrentRoom } from "../../../store/workspace";
import { io } from 'socket.io-client';
let socket;

const MainContent = () => {
  const [loaded, setloaded] = useState(false);
  const dispatch = useDispatch();
  let url = window.location.href;
  const [dmRoom, setDmRoom] = useState();
  const [channelRoom, setChannelRoom] = useState();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector(state => state.session.user);

  const view = useSelector((state) => state.workspace.currentView);
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
      setMessages(messages => [...messages, chat])
    })
    // when component unmounts, disconnect
    return (() => {
      socket.disconnect()
    })
  }, [dispatch, url]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value)
  };

  const sendChat = (e) => {
    e.preventDefault()
    socket.emit("chat", { user: user.username, msg: chatInput });
    setChatInput("")
  }

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
        {view.messages.map((message) => (
          <div key={message.id}>
            {message.content} {message.sender_username}
            {message.created_at}
          </div>
        ))}
        <div>
          {messages.map((message, ind) => (
            <div key={ind}>{`${message.user}: ${message.msg}`}</div>
          ))}
        </div>
        <form onSubmit={sendChat}>
          <input
            value={chatInput}
            onChange={updateChatInput}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    )
  );
};

export default MainContent;
