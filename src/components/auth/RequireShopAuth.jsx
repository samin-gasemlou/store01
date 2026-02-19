import { Navigate, useLocation } from "react-router-dom";
import { getShopAccessToken } from "../../services/shopAuthApi";

export default function RequireShopAuth({ children }) {
  const location = useLocation();
  const token = getShopAccessToken();

  // اگر توکن نداریم، بفرست به صفحه ورود
  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}
