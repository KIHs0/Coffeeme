import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { getotheruser, getProfilethunk } from "./store2/user/user.thunk";
function App() {
  const dispatch = useDispatch()
  const { isAuthenticate, userProfile, screenLoading } = useSelector(state => state.userReducers)
  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(getProfilethunk()),
        dispatch(getotheruser())
      ]);
    })()
  }, [isAuthenticate])
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
