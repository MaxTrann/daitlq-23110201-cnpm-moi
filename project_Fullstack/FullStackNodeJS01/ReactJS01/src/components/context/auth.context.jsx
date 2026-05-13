import { createContext, useEffect, useState } from 'react';
import axios from '../../util/axios.customize';

const defaultAuthState = {
    isAuthenticated: false,
    user: {
        id: "",
        email: "",
        name: "",
        role: ""
    }
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

            const res = await axios.get('/v1/api/account');
            if (res && !res.message) {
                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: res.id ?? "",
                        email: res.email ?? "",
                        name: res.name ?? "",
                        role: res.role ?? ""
                    }
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
        <AuthContext.Provider value={{
            auth, setAuth, appLoading, setAppLoading
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}
