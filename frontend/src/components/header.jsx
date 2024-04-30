import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:3000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:3000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    if (setUserInfo(null)) {
      return "/";
    }
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <img src="/faviconio-logo/logo.png" height="70" alt="Logo" />
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">
              <Button variant="contained" color="primary">
                <AddIcon /> Create post
              </Button>
            </Link>
            <a onClick={logout}>
              <Button variant="contained" color="warning">
                <LogoutIcon /> Logout ({username})
              </Button>
            </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/log">
              <Button variant="contained" color="success">
                <LoginIcon /> Log in
              </Button>
            </Link>
            <Link to="/sign">
              <Button variant="contained" color="primary">
                <PersonAddIcon /> Sign up
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
