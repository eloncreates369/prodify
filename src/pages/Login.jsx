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
      window.location.href = "/";
    }else{
      alert(res.message || "Login failed");
    }

  }

  return (
    <div style={{padding:40,maxWidth:400,margin:"auto"}}>
      <h2>Login</h2>

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
        onClick={handleLogin}
        style={{width:"100%",padding:10}}
      >
        Login
      </button>

      <br/><br/>

      <p>
        No account? <Link to="/register">Register here</Link>
      </p>

    </div>
  );
}