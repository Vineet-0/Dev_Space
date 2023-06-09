import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
// import { children } from "react";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room"
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader'
function App() {

  // call refresh endpoint
    const { loading } = useLoadingWithRefresh();

    return loading ? (
      <Loader message="Loading, please wait.." />
    ) : (
      <Router>
        <Navigation />
        <Routes>
          
          <Route
            path="/"
            element={
            <GuestRoute >
              <Home/>
            </GuestRoute>}
          />
          <Route
            path="/authenticate"
            element={
            <GuestRoute >
              <Authenticate/>
            </GuestRoute>}
          />

          <Route
            path="/activate"
            element={
            <SemiProtected>
              <Activate/>
            </SemiProtected>}
          />

          <Route
            path="/rooms"
            element={
            <Protected>
              <Rooms/>
            </Protected>}
          />

          <Route
            path="/room/:id"
            element={
            <Protected>
              <Room/>
            </Protected>}
          />

        </Routes>
      </Router>
  );
}

export default App;


const GuestRoute = ({children, ...rest}) => {
  const {isAuth} = useSelector((state) => state.auth);
  if (isAuth) {
    return <Navigate to="/rooms" replace />
  }
  return children;
}

const SemiProtected = ({children, ...rest }) => {
  const {user, isAuth} = useSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/" replace />
  }else if(isAuth && !user.activated){
    return children;
  }
  return <Navigate to="/rooms" replace />;
}

const Protected = ({children, ...rest }) => {
  const {user, isAuth} = useSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/" replace />
  }else if(isAuth && !user.activated){
    return <Navigate to="/activate" replace />
  }
  return children;
}  
