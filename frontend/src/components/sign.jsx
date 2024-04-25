import { useState } from "react";

export default function Sign() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(ev) {
    ev.preventDefault();

    const response = await fetch("http://localhost:3000/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 200) {
      alert("Sign up successful");
    } else {
      alert("Sign up failed");
    }
  }

  return (
    <form className="sign">
      <center>
        <h1>Create your account</h1>
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
      <button onClick={submit}>Sign Up</button>
    </form>
  );
}
