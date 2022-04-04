import "./MainContent.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const MainContent = () => {
  const dispatch = useDispatch();
  const [loaded, setloaded] = useState(false);
  let { id } = useParams();
  let url = window.location.href;
  console.log(url.includes("dm_rooms"));

  useEffect(() => {
    if (url.includes("channels")) {
      //dispatch the thing.then setloaded true
    }
    if (url.includes("dm_rooms")) {
      //dispatch the thing.then setloaded true
    }
  });
  return (
    <div>
      <h2>Main Content</h2>
    </div>
  );
};

export default MainContent;
