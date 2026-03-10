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

      navigate("/login");   // ← correct redirect
    }else{
      alert(res.message || "Registration failed");
    }

  }

  return(
    <div style={{padding:40,maxWidth:400,margin:"auto"}}>
      <h2>Create Account</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        style={{width:"100%",padding:8}}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        style={{width:"100%",padding:8}}
      />

      <br/><br/>

      <button
        onClick={handleRegister}
        style={{width:"100%",padding:10}}
      >
        Register
      </button>

      <br/><br/>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </div>
  );
}