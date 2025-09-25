import React, { useEffect, useState } from "react";
import api from "../config/axios";
import NotFound from "../pages/NotFound/NotFound";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"guest" | "user" | "admin">("guest");

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await api.get("/auth/check-role");
        const userRole = res.data.data.role;
        setRole(userRole); 
      } catch (err) {
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (role !== "admin") return <NotFound />;

  return <>{children}</>;
};


export default AdminRoute;
