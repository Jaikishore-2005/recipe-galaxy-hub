
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// This page redirects to the Home page
const Index = () => <Navigate to="/" replace />;

export default Index;
