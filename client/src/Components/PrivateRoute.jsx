import{Outlet, Navigate} from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const { user: currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}