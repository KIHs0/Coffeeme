import { Navigate } from "react-router";

export default function GuestRoute({ children }) {
    const isAuthenticate = localStorage.getItem("etac");
    console.log(isAuthenticate)
    if (!isAuthenticate) {
        return <Navigate to="/" replace />;
    }
    return children;
}
