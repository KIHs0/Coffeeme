import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function GuestRoute({ children }) {
    const { isAuthenticate, screenLoading, userProfile } = useSelector(
        (state) => state.userReducers
    );


    if (userProfile) {
        console.log("vhag madarchod")
        return <Navigate to="/" replace />;
    }

    return children;
}
