import "./App.css";

import HomePage from "./pages/HomePage";
import AllNGOS from "./pages/AllNGOS";
import NGOPage from "./pages/NGOPage";
import FoodDetails from "./pages/FoodDetails";
import CategorySelection from "./pages/CategorySelection";
import ChooseRole from "./pages/ChooseYourRole";
import DeliverSelection from "./pages/DeliverSelection";
import DonationSelection from "./pages/DonationSelection";
import Profile from "./pages/Profile/Profile";
import Signup from "./pages/Signup";
import FirstPage from "./pages/FirstPage";

import { Switch, Route } from "react-router-dom";
import ConfirmFoodDetails from "./pages/ConfirmFoodDetails";
import { useState, useEffect } from "react";

import axios from "axios";

function App() {
  const [ngoData, setData] = useState(null);
  const [userData, setUser] = useState({ isFetched: false, user: null });
  const [isLoad, setLoad] = useState(true);

  const getNgoData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ngos`
      );
      setData([...data]);
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser({ isFetched: true, user: null });
        return;
      }

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUser({ isFetched: true, user: data.user });
    } catch (err) {
      console.log('Auth error:', err);
      localStorage.removeItem('token'); // Clear invalid token
      setUser({ isFetched: true, user: null });
    }
  };

  useEffect(() => {
    getNgoData();
    getUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [foodData, setFoodData] = useState({ type: "", meal: "", quantity: 0 });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser({ user: null, isFetched: true });
  };

  // Show loading while checking user state
  if (!userData.isFetched) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Show signup/login if no user
  if (userData.isFetched && !userData.user) {
    return <div className="App">{isLoad ? <FirstPage /> : <Signup />}</div>;
  }

  // Show main app if user is logged in
  return (
    <div className="App">
      <Switch>
        <Route exact path="/profile">
          <Profile user={userData.user} logout={logout} />
        </Route>

        <Route exact path="/">
          {ngoData ? <HomePage data={ngoData} /> : null}
        </Route>

        <Route path="/category" exact>
          <CategorySelection />
        </Route>

        <Route path="/all" exact>
          {ngoData ? <AllNGOS data={ngoData} /> : null}
        </Route>

        <Route path="/all/:id" exact>
          {ngoData ? <NGOPage data={ngoData} /> : null}
        </Route>

        <Route path="/foodDetails" exact>
          <FoodDetails handleInput={handleInput} />
        </Route>

        <Route path="/delivery" exact>
          <DeliverSelection />
        </Route>

        <Route path="/donation" exact>
          <DonationSelection />
        </Route>

        <Route path="/confirm" exact>
          <ConfirmFoodDetails foodData={foodData} />
        </Route>

        <Route path="/role" exact>
          <ChooseRole />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
