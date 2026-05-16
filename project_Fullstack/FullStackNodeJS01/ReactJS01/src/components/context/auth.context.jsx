import { createContext, useEffect, useState } from "react";
import axios from "../../utils/axios.customize";

const defaultAuthState = {
  isAuthenticated: false,
  user: {
    id: "",
    email: "",
    name: "",
    role: "",
    phone: "",
    address: "",
    avatar: "",
  },
};

export const AuthContext = createContext({
  ...defaultAuthState,
  appLoading: true,
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState(defaultAuthState);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setAppLoading(false);
        return;
      }

      const res = await axios.get("/v1/api/account");
      if (res?.EC === 0 && res?.data) {
        setAuth({
          isAuthenticated: true,
          user: {
            id: res.data.id ?? "",
            email: res.data.email ?? "",
            name: res.data.name ?? "",
            role: res.data.role ?? "",
            phone: res.data.phone ?? "",
            address: res.data.address ?? "",
            avatar: res.data.avatar ?? "",
          },
        });
      } else {
        localStorage.removeItem("access_token");
        setAuth(defaultAuthState);
      }

      setAppLoading(false);
    };

    fetchAccount();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
