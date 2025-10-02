import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function GuestRoute({ children }) {
    const { isAuthenticate, screenLoading } = useSelector(
        (state) => state.userReducers
    );


    if (isAuthenticate) {
        console.log(isAuthenticate)
        return <Navigate to="/" replace />;
    }

    return children;
}
