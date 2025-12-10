import { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

/**
 * Custom hook để kiểm tra xem socket đã sẵn sàng (connected) chưa
 * Trả về: true nếu socket tồn tại AND kết nối thành công
 *         false nếu socket chưa tồn tại HOẶC chưa kết nối
 */
export const useSocketReady = () => {
  const { socket, connected } = useSocket();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Socket ready chỉ khi vừa có socket vừa connected = true
    setIsReady(! !(socket && connected));
  }, [socket, connected]);

  return isReady;
};