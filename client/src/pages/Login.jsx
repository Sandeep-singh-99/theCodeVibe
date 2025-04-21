import React, { useEffect, useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../redux/slice/authSlice';
import toast from 'react-hot-toast';
import { useLogin } from '../api/authApi';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginMutation = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      return
  }

    const formData = {
      email,
      password
    }
    
    loginMutation.mutate(formData)
  }

  useEffect(() => {
    if (loginMutation.isSuccess) {
      toast.success(loginMutation.data.message)
      dispatch(login(loginMutation.data.data))
      navigate("/")
    }
    if (loginMutation.isError) {
      toast.error(loginMutation.error.response?.data?.message || loginMutation.error.message)
    }
  })
  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-96 p-6 border border-gray-700 rounded-xl shadow-2xl">
        <div className="mb-6">
          <h1 className="text-4xl text-center font-serif font-bold text-white">
            Insta
          </h1>
          <p className="text-center text-gray-500 text-sm mt-2">
            Welcome back! Please login
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-400 transition-colors">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-400 transition-colors">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            className="w-full bg-white text-black font-semibold py-2 rounded-md mt-6 cursor-pointer"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}
