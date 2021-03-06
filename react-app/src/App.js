import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import Workspaces from "./components/AllWorkspaces";
import OneWorkspace from "./components/OneWorkspace";
import WorkspaceForm from "./components/workspace_form";
import ChannelForm from "./components/OneWorkspace/LeftSideBar/ChannelForm";
import { authenticate } from "./store/session";
function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/" exact={true}>
          <Workspaces userId={user?.id} />
        </ProtectedRoute>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute
          path="/workspaces/:workspaceId/channels/:channelId"
          exact={true}
        >
          <NavBar />
          <OneWorkspace />
        </ProtectedRoute>
        <ProtectedRoute path="/workspaces/:workspaceId/general" exact={true}>
          <NavBar />
          <OneWorkspace />
        </ProtectedRoute>
        <ProtectedRoute
          path="/workspaces/:workspaceId/dm_rooms/:dmRoomId"
          exact={true}
        >
          <NavBar />
          <OneWorkspace />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path="/workspaces/new" exact={true}>
          <WorkspaceForm />
        </ProtectedRoute>
        <ProtectedRoute path={`/workspaces/:workspaceId`}>
          <NavBar />
          <OneWorkspace />
        </ProtectedRoute>
        <ProtectedRoute path="/channels/new" exact={true}>
          <ChannelForm />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
