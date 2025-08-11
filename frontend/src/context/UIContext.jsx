import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("success");

  const showMessage = (msg, msgType = "success") => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <UIContext.Provider value={{ message, type, showMessage }}>
      {children}
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white z-50 ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {message}
        </div>
      )}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
