import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { error } from "~/utils/errors";

type AlertType = "info" | "warning" | "error" | "success" | "none";

type AlertMessage = {
  alertData: error | null;
  setAlertData: React.Dispatch<React.SetStateAction<error | null>>;
};

const getAlertTypeFromHTTPCode = (code: number): AlertType => {
  switch (code) {
    case 100:
      return "info";
    case 200:
    case 201:
      return "success";
    case 300:
      return "warning";
    case 400:
    case 500:
      return "error";
  }
  return "none";
};

const AlertMessageIcon = ({ type }: { type: AlertType }) => {
  switch (type) {
    case "info":
      return <InformationCircleIcon className="h-5 w-5 stroke-2" />;
    case "warning":
      return <ExclamationTriangleIcon className="h-5 w-5 stroke-2" />;
    case "error":
      return <XCircleIcon className="h-5 w-5 stroke-2" />;
    case "success":
      return <CheckCircleIcon className="h-5 w-5 stroke-2" />;
  }
  return <></>;
};

const AlertMessage = ({ alertData, setAlertData }: AlertMessage) => {
  const [alertType, setAlertType] = useState<AlertType>("none");
  const [alertMessage, setAlertMessage] = useState("");
  const [state, setState] = useState<"closing" | "open" | "closed">("closed");

  useEffect(() => {
    if (alertData) {
      const { code, message } = alertData;
      const type = getAlertTypeFromHTTPCode(code);
      setAlertType(type);
      setAlertMessage(message);
      setState("open");
      const delayTimeout = setTimeout(() => {
        setState("closing");
      }, 2000);
      return () => clearTimeout(delayTimeout);
    } else {
      setState("closed");
    }
  }, [alertData]);

  if (state === "closed") return <></>;
  return (
    <div className="toast toast-bottom toast-center w-full md:w-1/2 z-[1000]">
      <div
        className={`alert alert-${alertType} transition duration-[3000ms]`}
        style={state !== "open" ? { opacity: 0 } : {}}
        {...(state === "closing"
          ? { onTransitionEnd: () => setState("closed") }
          : {})}
      >
        <div className="w-full">
          <AlertMessageIcon type={alertType} />
          <span className="flex-1">{alertMessage}</span>
          <XMarkIcon
            className="h-5 w-5 stroke-2"
            onClick={() => setAlertData(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;
