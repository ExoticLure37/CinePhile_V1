import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        {
          email,
          password,
          rememberMe,
        },
        { withCredentials: true }
      );

      alert("Login Successful!");
      // navigate("/dashboard"); // Redirect after successful login
      console.log(email);
      console.log(password);
      console.log(rememberMe);
    } catch (err) {
      console.log(err.response?.data?.message || "Login Failed!");
    }
    //  } catch (err) {
    //    console.log(err);
    //  }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* header */}
      <div
        className="h-14 w-screen flex justify-between 
            items-center mb-auto
            bg-red-600"
      >
        <h1 className="ml-5 text-lg">projectV</h1>

        <span className="mr-2">SignIn</span>
      </div>

      {/* form-data */}
      <div
        className="flex mb-auto justify-between
            bg-slate-900 h-screen text-white items-center"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mx-auto w-1/4"
        >
          <h1 className="text-3xl font-bold">SignIn</h1>

          {error && <p className="text-red-500">{error}</p>}

          <span>E-mail</span>
          <input
            className="rounded-sm pl-1"
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <span>Password</span>
          <input
            className="rounded-sm pl-1"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span className="ml-2">Remember Me</span>
          </div>

          {/* <button className=" */}
          <button
            type="submit"
            className="bg-red-600 rounded-sm hover:bg-red-500"
          >
            Sign In
          </button>

          <span className="mx-auto">Not having an Account?</span>
          <Link to="/">
            <button className="bg-red-600 rounded-sm hover:bg-red-500 w-full">
              Create an Account
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
