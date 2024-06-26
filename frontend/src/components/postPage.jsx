import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  if (!postInfo) {
    return "/";
  }

  async function deletePost() {
    try {
      const response = await fetch(`http://localhost:3000/deletePost/${id}`);
      if ((await response.json()) === "ok") {
        return "/";
      }
    } catch (err) {
      throw err;
    }
  }

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <Button variant="contained" color="secondary">
              {" "}
              <EditIcon /> Edit this post
            </Button>
          </Link>
          <Link className="delete-btn" to={`/`}>
            <Button variant="contained" color="error" onClick={deletePost}>
              {" "}
              <DeleteIcon /> Delete this post
            </Button>
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:3000/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
