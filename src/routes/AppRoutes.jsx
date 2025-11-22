import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import useRefreshTokenOnLoad from "../hooks/useRefreshTokenOnLoad";

// Layout
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";
import { Test } from "../pages/MockTest/Test";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import Profile from "../pages/Profile/Profile";
import UpdateProfile from "../pages/Profile/UpdateProfile/UpdateProfile";
import Payment from "../pages/Payment/Payment";
import PurchaseHistory from "../pages/Payment/PurchaseHistory";
import PaymentForm from "../pages/Payment/PaymentForm/PaymentForm";
import Resource from "../pages/Resource/Resource";
import History from "../pages/History/History";
import ResourceDetail from "../pages/Resource/ResourceDetail";
import DetailTestPage from "../pages/Detail/DetailTestPage";
import PaymentFail from "../pages/Payment/PaymentFail";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import ResultPage from "../pages/MockTest/result/ResultPage";
import FlashcardPage from "../pages/FlashCard/FlashcardPage";
import FlashcardListPage from "../pages/FlashCard/FlashcardListPage";
import TestList from "../pages/MockTest/TestList";
import HomePage from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Feat from "../pages/Login/FeaturesPage";
import NotFound from "../pages/NotFound/NotFound";
import Terms from "../pages/Info/Terms";
import Privacy from "../pages/Info/Privacy";
import Support from "../pages/Support/Support";

const RefreshTokenLoader = () => {
  useRefreshTokenOnLoad();
  return null;
};

// Cấu hình routes
const routes = [
  {
    path: "/", // Trang Home, cho mọi user
    element: (
      <>
        <RefreshTokenLoader />
        <MainLayout>
          <HomePage />
        </MainLayout>
      </>
    ),
  },
  {
    path: "/login", // Trang dành cho Guest (Guest-only)
    element: (
      <MainLayout>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/support",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <MainLayout>
          <Support />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/features", // Trang dành cho Guest (Guest-only)
    element: (
      <MainLayout>
        <Feat />
      </MainLayout>
    ),
  },
  {
    path: "/forgot-password", // Trang dành cho Guest (Guest-only)
    element: (
      <MainLayout>
        <ForgotPassword />
      </MainLayout>
    ),
  },
  {
    path: "*", // Trang 404
    element: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <MainLayout>
        <ResetPassword />
      </MainLayout>
    ),
  },
  {
    path: "/terms",
    element: (
      <MainLayout>
        <Terms />
      </MainLayout>
    ),
  },
  {
    path: "/privacy",
    element: (
      <MainLayout>
        <Privacy />
      </MainLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <MainLayout>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/tests",
    element: (
      <MainLayout>
        <TestList limit={9} showPagination={true} />
      </MainLayout>
    ),
  },
  {
    path: "/session/:id",
    element: (
      <MainLayout>
        <Test isView={false} />
      </MainLayout>
    ),
  },
  {
    path: "/session/view/:id",
    element: (
      <MainLayout>
        <Test isView={true} />
      </MainLayout>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <MainLayout>
        <Leaderboard />
      </MainLayout>
    ),
  },
  {
    path: "/session/:id/results",
    element: (
      <MainLayout>
        <ResultPage />
      </MainLayout>
    ),
  },
  {
    path: "/test/:slug",
    element: (
      <MainLayout>
        <DetailTestPage />
      </MainLayout>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <MainLayout>
          <Profile />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/update-info",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <MainLayout>
          <UpdateProfile />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <MainLayout>
        <Payment />
      </MainLayout>
    ),
  },
  {
    path: "/payment/paymentform",
    element: (
      <MainLayout>
        <PaymentForm />
      </MainLayout>
    ),
  },
  {
    path: "/payment/success",
    element: (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <MainLayout>
        <PaymentSuccess />
      </MainLayout>
    </ProtectedRoute>
    ),
  },
  {
    path: "/payment/fail",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <MainLayout>
          <PaymentFail />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/resource",
    element: (
      <MainLayout>
        <Resource />
      </MainLayout>
    ),
  },
  {
    path: "/resource/:id",
    element: (
      <MainLayout>
        <ResourceDetail />
      </MainLayout>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <MainLayout>
          <History />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/purchase-history",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <MainLayout>
          <PurchaseHistory />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/flashcard",
    element: (
      <MainLayout>
        <FlashcardPage />
      </MainLayout>
    ),
  },
  {
    path: "/flashcards/:setId",
    element: (
      <MainLayout>
        <FlashcardListPage />
      </MainLayout>
    ),
  }
];

const AppRoutes = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
