import { useState } from "react";
import { register } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister(){

    const res = await register(email,password);

    if(res.message){
      alert("Account created successfully");
      navigate("/login");
    }else{
      alert(res.message || "Registration failed");
    }

  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">

      <div className="bg-white w-[380px] p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Join Prodify today
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
          onClick={handleRegister}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?
          <Link to="/login" className="text-indigo-600 font-semibold ml-1">
            Login
          </Link>
        </p>

      </div>

    </div>

  );
}