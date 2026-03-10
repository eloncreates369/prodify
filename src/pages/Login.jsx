import { useState } from "react";
import { login } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(){

    const res = await login(email,password);

    if(res.token){
      navigate("/");
    }else{
      alert(res.message || "Login failed");
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">

      <div className="bg-white w-[380px] p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Prodify
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Sign in to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don’t have an account?
          <Link to="/register" className="text-indigo-600 font-semibold ml-1">
            Register
          </Link>
        </p>

      </div>

    </div>

  );

}