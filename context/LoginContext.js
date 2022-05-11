import React, {useState} from 'react';

export const LoginContext = React.createContext({
  isLogin: false,
  login: () => {},
  logout: () => {},
});

function LoginContextProvider({children}) {
  const [isLogin, setIsLogin] = useState(true);

  function login() {
    setIsLogin(true);
  }

  function logout() {
    setIsLogin(false);
  }

  const value = {
    isLogin,
    login,
    logout,
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}

export default LoginContextProvider;
