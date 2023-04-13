"use client";

import { useState, useEffect } from "react";
import config from "../../config";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    // Set isMounted to true after the component has been mounted on the client
    setIsMounted(true);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      // do something with username and password
      console.log(username);
      console.log(password);
      console.log(config.apiUrl);
      try {
        fetch(`http://localhost:3001/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            //console.log("Success:", data);
            if (data) {
              localStorage.setItem(
                "token",
                data.AuthenticationResult.AccessToken
              );
              console.log("token", data.AuthenticationResult.AccessToken);
              console.log("token", localStorage.getItem("token"));
              window.location.href = "/"; // Replace "/home" with the URL of your home page
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        console.log("WHYYY");
      } catch (error) {
        console.log(error);
      }
    } else if (!showVerification) {
      // do something with username, email, and password
      fetch(`${config.apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setShowVerification(true);
    } else {
      fetch(`${config.apiUrl}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          code: verificationCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
  };

  // Conditionally render the entire component based on isMounted
  return isMounted ? (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && showVerification && (
            <div className="mb-4">
              <label
                htmlFor="verificationCode"
                className="block text-gray-700 font-bold mb-2"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Verification Code"
                required
              />
            </div>
          )}
          {!isLogin && !showVerification && (
            <div className="mb-4">
              <label
                htmlFor="email" // Update the "htmlFor" attribute to match the input field's "id"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          )}
          {!showVerification && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleSwitchMode}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {isLogin
              ? "Don't have an account? Sign up!"
              : "Already have an account? Log in!"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default LoginPage;
