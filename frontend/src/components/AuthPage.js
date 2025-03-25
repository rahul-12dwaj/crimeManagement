import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";
import AdminLogin from "./AdminLogin"

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-cyan-300">
      {currentForm === "login" && <LoginForm onSwitch={setCurrentForm} />}
      {currentForm === "register" && <RegisterForm onSwitch={setCurrentForm} />}
      {currentForm === "forgot" && <ForgotPassword onSwitch={setCurrentForm} />}
      {currentForm === "admin" && <AdminLogin onSwitch={setCurrentForm} />}
    </div>
  );
};

export default AuthPage;
