import AppRoutes from "../src/routes/AppRoutes";
import { SocketProvider } from "./context/socket/SocketProvider";
import { SessionTestProvider } from "./context/sessionTest/SessionTestProvider";
import { NotificationProvider } from "./context/Notification/NotificationProvider";
// import Header from "./layouts/common/Header";

const App = () => {
  return <SocketProvider>
  <NotificationProvider>
    <SessionTestProvider>
      <AppRoutes />
    </SessionTestProvider>
  </NotificationProvider>
</SocketProvider>
};

export default App;