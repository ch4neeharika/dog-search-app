import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Please enter your name and email.");
            return;
        }

        try {
            const response = await axios.post(
                "https://frontend-take-home-service.fetch.com/auth/login",
                { name, email },
                { withCredentials: true }
            );

            localStorage.setItem("user", JSON.stringify({ name, email }));
            navigate("/search"); 
        } catch (error) {
            console.error("Login failed:", error.response?.data || error);
            alert(`Login failed: ${error.response?.data?.message || "Check API request format."}`);
        }
    };

    return (
        <div style={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            padding: "20px"
        }}>
            <div style={{ 
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                maxWidth: "400px",
                width: "100%"
            }}>
                
                <h1 style={{ 
                    fontSize: "2.5rem", 
                    color: "#ff6f61", 
                    marginBottom: "10px" 
                }}>
                    🐾 Fetch Your Furry Friend
                </h1>
                <p style={{ 
                    fontSize: "1.1rem", 
                    color: "#555", 
                    marginBottom: "30px" 
                }}>
                    Login to find your perfect dog match!
                </p>

               
                <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ 
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "1rem",
                            outline: "none",
                            transition: "border-color 0.3s",
                            ":focus": {
                                borderColor: "#ff6f61"
                            }
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ 
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "1rem",
                            outline: "none",
                            transition: "border-color 0.3s",
                            ":focus": {
                                borderColor: "#ff6f61"
                            }
                        }}
                    />
                    <button
                        type="submit"
                        style={{ 
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#ff6f61",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            ":hover": {
                                backgroundColor: "#ff4a4a"
                            }
                        }}
                    >
                        Login
                    </button>
                </form>

            
                <div style={{ marginTop: "30px" }}>
                    <img 
                        src="https://img.icons8.com/color/96/000000/dog.png" 
                        alt="Dog Illustration" 
                        style={{ width: "80px", height: "80px" }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;