import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styles from "./signup.module.css";

const Signup = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to sign up with backend
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: "1234567890", // Default phone number
          role: "donor"
        }
      );

      if (response.data.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);
        
        // Show success message
        alert('Account created successfully! Welcome to Seva.');
        
        // Force page reload to update user state
        window.location.href = '/';
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Join Seva</h1>
          <p className={styles.subtitle}>Start making a difference today</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={styles.signupButton}
          >
            <span className={styles.buttonText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </span>
            <div className={styles.buttonIcon}>
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                <span className={styles.arrow}>→</span>
              )}
            </div>
          </button>
        </form>
        
        <div className={styles.footer}>
          <p className={styles.loginText}>
            Already have an account? 
            <span className={styles.loginLink}> Sign in here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
