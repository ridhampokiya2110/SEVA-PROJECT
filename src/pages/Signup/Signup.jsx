import styles from "./signup.module.css";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

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
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
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
      // Redirect to Google OAuth
      window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
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
      // Redirect to Facebook OAuth
      window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook`;
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
          className={styles.signup_btn}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <div className={styles.or}>
        <div className={styles.number}>
          <p>or</p>
        </div>
      </div>

      <div className={styles.lower}>
        <p className={styles.signUpWith}>Sign up with</p>
        <div 
          onClick={handleGoogleLogin} 
          className={`${styles.google} ${socialLoading.google ? styles.loading : ''}`}
          style={{ opacity: socialLoading.google ? 0.7 : 1 }}
        >
          <FcGoogle className={styles.iconGoogle} />
          <p>{socialLoading.google ? "Connecting..." : "Login with Google"}</p>
        </div>
        <div 
          onClick={handleFacebookLogin} 
          className={`${styles.google} ${socialLoading.facebook ? styles.loading : ''}`}
          style={{ opacity: socialLoading.facebook ? 0.7 : 1 }}
        >
          <BsFacebook className={styles.iconFb} />
          <p>{socialLoading.facebook ? "Connecting..." : "Login with Facebook"}</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
