import React from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const Input = ({ type, placeholder, value, onChange, icon }) => (
  <div className="relative w-full sm:w-80 mb-3">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl">
      {icon}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 p-3 border border-cyan-400 bg-gray-900 text-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
    />
  </div>
);

const LoginForm = ({ onSwitch }) => {
  return (
    <div className="w-full sm:w-96 p-6 shadow-xl rounded-lg bg-gray-900/80 backdrop-blur-md text-cyan-300 flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Forgot Password</h2>
      

      <Input type="email" placeholder="Email" icon={<AiOutlineMail />} />
      <p className="italic">After clicking send button all your credential will sent on you Email Box</p>
      <button className="bg-cyan-500 text-black px-4 py-2 rounded-lg w-full my-2 hover:bg-cyan-400">
        Send
      </button>

      <p className="text-sm mt-3">
        New here?{" "}
        <button
          className="text-cyan-400 hover:underline"
          onClick={() => onSwitch("register")}
        >
          Register Now
        </button>
      </p>

      <p className="text-sm mt-2">
        Login?{" "}
        <button
          className="text-cyan-400 hover:underline"
          onClick={() => onSwitch("login")}
        >
          Click Here
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
