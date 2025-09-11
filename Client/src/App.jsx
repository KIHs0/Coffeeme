import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { getotheruser, getProfilethunk } from "./store2/user/user.thunk";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticate } = useSelector(state => state.userReducers);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticate && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      Promise.all([
        dispatch(getProfilethunk()),
        dispatch(getotheruser())
      ]).catch(err => console.error("Fetching <getprofileotheruser></getprofileotheruser> data failed:", err));
    }
  }, [isAuthenticate, dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
