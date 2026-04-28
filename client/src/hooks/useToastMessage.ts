import { useCallback, useState } from "react";

type UseToastMessageResult = {
  message: string;
  isFailed: boolean;
  isVisible: boolean;
  showToastMessage: (msg: string, failed?: boolean) => void;
  closeToastMessage: () => void;
  toggleToastMessage: () => void;
};

export function useToastMessage(
  initialMessage: string,
  initialIsFailed = false,
  initialIsVisible = false
): UseToastMessageResult {
  const [message, setMessage] = useState(initialMessage);
  const [isFailed, setIsFailed] = useState(initialIsFailed);
  const [isVisible, setIsVisible] = useState(initialIsVisible);

  const showToastMessage = useCallback((msg: string, failed: boolean = false) => {
    setMessage(msg);
    setIsFailed(failed);
    setIsVisible(true);
  }, []);

  const closeToastMessage = useCallback(() => {
    setMessage("");
    setIsVisible(false);
  }, []);

  const toggleToastMessage = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    message,
    isFailed,
    isVisible,
    showToastMessage,
    closeToastMessage,
    toggleToastMessage,
  };
}
