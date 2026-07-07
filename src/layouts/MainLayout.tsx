// MainLayout.tsx
import Header from "./common/Header";
import Footer from "./common/Footer";
import React, { useEffect, useState } from "react";
import { config } from "../config/env.config";
import { useLocation } from "react-router-dom";
import Chatbot from "../components/chatbot/Chatbot";
import FloatingDictionary from "../components/common/ActionMenu/FloatingActionMenu";
import useRefreshTokenOnLoad from "../hooks/useRefreshTokenOnLoad";
import api from "../config/axios";
import LoadingSkeleton from "../components/common/LoadingSpinner/LoadingSkeleton";
import MaintenancePage from "../pages/Maintenance/Maintenance";

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maintenanceState, setMaintenanceState] = useState({
    loading: true,
    active: false,
    message: "",
    startAt: null,
    endAt: null,
  });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchMaintenance = async () => {
      try {
        const res = await api.get("/system/maintenance");
        const state = res.data.data;

        if (!isMounted) return;

        setMaintenanceState({
          loading: false,
          active: Boolean(state?.active),
          message: state?.message || "",
          startAt: state?.startAt || null,
          endAt: state?.endAt || null,
        });
      } catch {
        if (isMounted) {
          setMaintenanceState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    fetchMaintenance();
    const intervalId = window.setInterval(fetchMaintenance, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useRefreshTokenOnLoad(!maintenanceState.loading && !maintenanceState.active);

  if (maintenanceState.loading) {
    return <LoadingSkeleton />;
  }

  if (maintenanceState.active) {
    return (
      <MaintenancePage
        message={maintenanceState.message}
        startAt={maintenanceState.startAt}
        endAt={maintenanceState.endAt}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const pathname = location.pathname;

  const isDoingTest = pathname.startsWith("/session/") && !pathname.startsWith("/session/view");

  const isSessionPage = pathname.startsWith("/session");

  const shouldShowChatbot = !isDoingTest;

  const clonedChildren = children
    ? React.cloneElement(children, { setIsOpen, maintenanceState })
    : null;

  const maintenanceOverlay = maintenanceState.active && isDoingTest;

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {maintenanceOverlay ? (
          <div className="relative min-h-screen">
            <div className="pointer-events-none select-none opacity-40">
              {clonedChildren}
            </div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
              <div className="w-full max-w-4xl">
                <MaintenancePage
                  message={maintenanceState.message}
                  startAt={maintenanceState.startAt}
                  endAt={maintenanceState.endAt}
                  onRetry={() => window.location.reload()}
                />
              </div>
            </div>
          </div>
        ) : maintenanceState.active ? (
          <MaintenancePage
            message={maintenanceState.message}
            startAt={maintenanceState.startAt}
            endAt={maintenanceState.endAt}
            onRetry={() => window.location.reload()}
          />
        ) : (
          clonedChildren
        )}
      </main>

      <FloatingDictionary />

      {shouldShowChatbot && (
        <Chatbot
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          socketUrl={`${config.apiBaseUrl}`}
        />
      )}

      {!isSessionPage && <Footer />}
    </>
  );
};

export default MainLayout;
