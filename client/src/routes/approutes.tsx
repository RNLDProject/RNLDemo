import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import GenderMainPage from "../pages/Gender/GenderMainPage";
import EditGenderPage from "../pages/Gender/EditGenderPage";
import DeleteGenderPage from "../pages/Gender/DeleteGenderPage";
import LoginPage from "../pages/Auth/LoginPage";
import UserMainPage from "../pages/User/UserMainPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/genders" element={<GenderMainPage />} />
        <Route path="/gender/edit/:gender_id" element={<EditGenderPage />} />
        <Route path="/gender/delete/:gender_id" element={<DeleteGenderPage />} />
        <Route path="/users" element={<UserMainPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;