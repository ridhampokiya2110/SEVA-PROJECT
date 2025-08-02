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
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  });

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
        // Navigate to home page after successful signup
        history.push("/");
        window.location.reload(); // Reload to update user state
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

  const handleGoogleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setError("");
    
    try {
      // For now, just show a message
      setError("Google login not implemented yet");
      setSocialLoading(prev => ({ ...prev, google: false }));
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookLogin = async () => {
    setSocialLoading(prev => ({ ...prev, facebook: true }));
    setError("");
    
    try {
      // For now, just show a message
      setError("Facebook login not implemented yet");
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    } catch (err) {
      console.error("Facebook login error:", err);
      setError("Facebook login failed. Please try again.");
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  return (
    <div className={styles.main}>
      <h1>Sign up</h1>
      <form className={styles.form} onSubmit={handleSignup}>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Name" 
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email Address "
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <div className={styles.socialLogin}>
        <p>Or sign up with:</p>
        <button
          onClick={handleGoogleLogin}
          disabled={socialLoading.google}
          className={styles.googleButton}
        >
          {socialLoading.google ? "Loading..." : "Google"}
        </button>
        <button
          onClick={handleFacebookLogin}
          disabled={socialLoading.facebook}
          className={styles.facebookButton}
        >
          {socialLoading.facebook ? "Loading..." : "Facebook"}
        </button>
      </div>
    </div>
  );
};

export default Signup;
