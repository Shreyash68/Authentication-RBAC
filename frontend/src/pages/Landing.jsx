import { useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate } from "react-router-dom"


function Landing() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    role: 'user'
  });


  const handleLogin = async () => {
    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData)
      });

      const me = await apiRequest("/auth/me");
      console.log(me);
      if (me.role === "admin") {
        console.log("admin");
        navigate("/admin");
      } else {
        console.log("user");
        navigate("/user");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignup = () => {
    console.log('Signup:', signupData);
    setShowSignupModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-sans">
      {/* HERO SECTION */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Task Manager
          </h1>
          <p className="text-2xl md:text-2xl mb-8 opacity-80">
            JWT Auth • Role-Based Access • Full CRUD
          </p>
          <p className="text-base max-w-2xl mx-auto mb-10 opacity-70">
            Production-ready task management with FastAPI, MongoDB, and React
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => setShowSignupModal(true)}
              className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign Up
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-4 border-2 border-black text-black text-lg font-semibold rounded-xl hover:bg-black hover:text-white transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="font-bold text-lg mb-2">JWT Auth</h3>
            <p className="text-sm opacity-75">Secure token-based authentication</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">👑</div>
            <h3 className="font-bold text-lg mb-2">Role-Based</h3>
            <p className="text-sm opacity-75">Admin & User access control</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Full CRUD</h3>
            <p className="text-sm opacity-75">Complete task management</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">FastAPI</h3>
            <p className="text-sm opacity-75">Modern Python backend</p>
          </div>
        </div>

        {/* ROLES COMPARISON */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👤</span>
              <h3 className="text-2xl font-bold">User Role</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> View assigned tasks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Update task status
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Dashboard access
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🛠️</span>
              <h3 className="text-2xl font-bold">Admin Role</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> All user permissions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Create & assign tasks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Edit & delete tasks
              </li>
            </ul>
          </div>
        </div>

        {/* TECH STACK */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-6">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">🐍 FastAPI</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">📦 MongoDB</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">⚛️ React</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">🔗 Axios</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">🔐 JWT</span>
          </div>
        </div>
      </section>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-[scale-in_0.2s_ease-out]">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-2xl hover:text-gray-600 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-600">Login to your account</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                User role is validated against the database using an <p className="text-black text-xl font-bold">indexed email lookup</p>
                Role information is fetched server-side.
              </p>


              {/* <div>
                <label className="block text-sm font-semibold mb-2">Role</label>
                <select
                  value={loginData.role}
                  onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors bg-white"
                >
                  <option value="user">👤 User</option>
                  <option value="admin">🛠️ Admin</option>
                </select>
              </div> */}

              <button
                onClick={handleLogin}
                className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="text-black font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-[scale-in_0.2s_ease-out]">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-2xl hover:text-gray-600 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-600">Join us today</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Role</label>
                <select
                  value={signupData.role}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors bg-white"
                >
                  <option value="user">👤 User</option>
                  <option value="admin">🛠️ Admin</option>
                </select>
              </div>

              <button
                onClick={handleSignup}
                className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                className="text-black font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default Landing