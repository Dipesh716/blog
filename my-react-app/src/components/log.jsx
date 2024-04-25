import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function Log() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function submitL(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:3000/log", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="log">
      <center>
        {" "}
        <h1>Log in to Blog</h1>
      </center>

      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button onClick={submitL}>Log In</button>
    </form>
  );
}
