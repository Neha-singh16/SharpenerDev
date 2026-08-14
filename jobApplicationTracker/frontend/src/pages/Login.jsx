import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {Link} from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");


    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setError("");

            const response =
                await api.post(
                    "/auth/login",
                    form
                );

            const token =
                response.data.data.token;

            localStorage.setItem(
                "token",
                token
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }


    return (
        <div className="auth-page">

            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >

                <h1>Job Application Tracker</h1>

                <h2>Login</h2>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>
                  <div className="auth-footer">
                          <span>Don't have an account?</span>
                
                          <Link to="/signup">Create Account</Link>
                        </div>

            </form>

        </div>
    );
}

export default Login;