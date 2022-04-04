import "./MainContent.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getChannelMessages, getDirectMessages } from "../../../store/message";

const MainContent = () => {
  const dispatch = useDispatch();
  const [loaded, setloaded] = useState(false);

  let url = window.location.href;
  const [dmRoom, setDmRoom] = useState(url.includes("dm_rooms"));
  const [channelRoom, setChannelRoom] = useState(url.includes("channels"));

  let { id } = useParams();

  const messagesObj = useSelector((state) => state.message);
  const messages = Object.entries(messagesObj);

  console.log("hereeeeeeeeeeee", messages);

  useEffect(() => {
    if (channelRoom) {
      //dispatch the thing.then setloaded true
      dispatch(getChannelMessages(id)).then(() => setloaded(true));
    }
    if (dmRoom) {
      //dispatch the thing.then setloaded true
      dispatch(getDirectMessages(id)).then(() => setloaded(true));
    }
  }, []);
  return (
    loaded && (
      <div>
        {messages.map((message) => (
          <div key={message[1].id}>
            {message[1].content} {message[1].sender_username}{" "}
            {message[1].created_at}
          </div>
        ))}
      </div>
    )
  );
};

export default MainContent;
