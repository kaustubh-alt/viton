import React, { useState } from "react";
import './login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const API_URL = "http://localhost:8000/login"; // Make sure this matches FastAPI

    const Validate = async () => {

        const payload = {
            email: username,  // Replace with state value
            password: password,  // Replace with state value
        };
    
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Tell server we're sending JSON
                },
                body: JSON.stringify(payload),  // Convert JS object to JSON
            });


    
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
    
            const data = await response.json();
    
            if (!data.authentic) {
                throw new Error(data.message || "Login failed");
            }
    
            setMessage("Login Succesfully"); // Store auth state
            setTimeout(() => {
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            console.error("Fetch error:", error);
            setMessage(error.message);
        }
    };
    


    return (
        <div className="login-con">
            <div class="floating-shapes">
                <div class="shape"></div>
                <div class="shape"></div>
                <div class="shape"></div>
                <div class="shape"></div>
                <div class="shape"></div>
            </div>

            <div class="card shadow-lg" style={{ width: "22rem" }}>
                <h2 class="text-center text-white mb-4"><i class="fa-solid fa-user-lock"></i> Login</h2>
                <span>
                    <p style={{ textAlign: "center",color:'lightgrey',fontSize:'1.5rem' }}> {message} </p>
                </span>
                <div class="mb-3">
                    <label class="form-label"><i class="fa-solid fa-user icon"></i>Username</label>
                    <input id="email" type="email" class="form-control" placeholder="Enter your email" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div class="mb-3">
                    <label class="form-label"><i class="fa-solid fa-lock icon"></i>Password</label>
                    <input id="password" type="password" class="form-control" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button class="btn btn-primary w-100" onClick={Validate}>
                    <i class="fa-solid fa-arrow-right-to-bracket"></i>
                    Login</button>
            </div>
        </div>
    )
}

export default Login;