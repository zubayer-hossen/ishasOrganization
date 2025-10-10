import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "./authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const submit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
    // redirect to dashboard
  };
  return (
    <form onSubmit={submit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button>Login</button>
    </form>
  );
}
