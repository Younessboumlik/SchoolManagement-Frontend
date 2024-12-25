import React, { useState } from "react";
import "./login.css";

function LoginComponent() {
  const [isProfessor, setIsProfessor] = useState(true);
  const [notValid, setNotValid] = useState(false);

  const getLogin = (e) => {
    console.log("Login Input:", e.target.value);
  };

  const getPassword = (e) => {
    console.log("Password Input:", e.target.value);
  };

  const check = () => {
    setNotValid(true);
  };
  


  return (
    
    <div className="login-container-special">
      <div
        className={`login-card-special ${
          isProfessor ? "professor-active-special" : "admin-inactive-special"
        }`}
      >
        <h2>Professor Login</h2>
        {notValid && (
          <div className="login-alert-special">Invalid credentials</div>
        )}
        <div className="login-input-group-special">
          <label htmlFor="professorEmail" className="login-label-special">
            Email Address
          </label>
          <input
            type="text"
            className="login-input-special"
            id="professorEmail"
            placeholder="Enter your email"
            onChange={getLogin}
          />
        </div>
        <div className="login-input-group-special">
          <label htmlFor="professorPassword" className="login-label-special">
            Password
          </label>
          <input
            type="password"
            className="login-input-special"
            id="professorPassword"
            placeholder="Enter your password"
            onChange={getPassword}
          />
        </div>
        <button className="login-button-special" onClick={check}>
          Login
        </button>
        <p
          onClick={() => setIsProfessor(false)}
          className="login-switch-text-special"
        >
          Switch to Admin Login
        </p>
      </div>

      <div
        className={`login-card-special ${
          !isProfessor ? "admin-active-special" : "professor-inactive-special"
        }`}
      >
        <h2>Admin Login</h2>
        {notValid && (
          <div className="login-alert-special">Invalid credentials</div>
        )}
        <div className="login-input-group-special">
          <label htmlFor="adminEmail" className="login-label-special">
            Email Address
          </label>
          <input
            type="text"
            className="login-input-special"
            id="adminEmail"
            placeholder="Enter your email"
            onChange={getLogin}
          />
        </div>
        <div className="login-input-group-special">
          <label htmlFor="adminPassword" className="login-label-special">
            Password
          </label>
          <input
            type="password"
            className="login-input-special"
            id="adminPassword"
            placeholder="Enter your password"
            onChange={getPassword}
          />
        </div>
        <button className="login-button-special" onClick={check}>
          Login
        </button>
        <p
          onClick={() => setIsProfessor(true)}
          className="login-switch-text-special"
        >
          Switch to Professor Login
        </p>
      </div>
    </div>
  );
}

export default LoginComponent;
