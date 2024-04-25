import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout.jsx";
import Log from "./components/log.jsx";
import Sign from "./components/sign.jsx";
import Create from "./components/Create.jsx";
import { UserContextProvider } from "./UserContext.jsx";
import IndexPage from "./components/indexPage.jsx";
import PostPage from "./components/postPage.jsx";
import EditPost from "./components/EditPost.jsx";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/log" element={<Log />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/create" element={<Create />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
export default App;
