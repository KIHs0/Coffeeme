import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function GuestRoute({ children }) {
    const { isAuthenticate, screenLoading, userProfile } = useSelector(
        (state) => state.userReducers
    );


    if (userProfile) {
        return <Navigate to="/" replace />;
    }

    return children;
}
