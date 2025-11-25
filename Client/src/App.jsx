import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { getotheruser, getProfilethunk } from "./store2/user/user.thunk";
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticate, screenLoading } = useSelector(state => state.userReducers);


  useEffect(() => {

    if (isAuthenticate) {
      Promise.all([
        dispatch(getProfilethunk()),
        dispatch(getotheruser())
      ]).catch(err => console.error("Fetching <getprofileotheruser></getprofileotheruser> data failed:", err));
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
