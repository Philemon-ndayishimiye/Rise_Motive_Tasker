import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../app/api/Auth/auth";

interface TaskerAdmin {
  role: "TASKER" | "MEDIA";
  taskerRole?: string;
  // add other fields your admin object has (id, email, name, etc.)
}

export default function TaskerLoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ADD THIS — see exactly what's being sent

    console.log("🔍 Submitting form:", JSON.stringify(form));
    console.log(
      "🔍 Email chars:",
      [...form.email].map((c) => c.charCodeAt(0)),
    );
    console.log("🔍 Password length:", form.password.length);

    try {
      const result = await login(form).unwrap();
      const { token, admin } = result;

      if (admin.role !== "TASKER" && admin.role !== "MEDIA") {
        setError("You are not authorized to access this portal.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(admin));

      // if (admin.role === "TASKER") {
      //   navigate("/tasker/dashboard");
      // } else if (admin.role === "MEDIA") {
      //   navigate("/media/dashboard");
      // }

      if (admin.role === "TASKER") {
        // Navigate based on taskerRole stored in profile
        // We use taskerRole from the login response if available
        const taskerRole = (admin as TaskerAdmin).taskerRole as
          | string
          | undefined;
        if (taskerRole === "RM_STAFF_MEMBER") {
          navigate("/staff/dashboard");
        } else if (taskerRole === "SENIOR_RMT_STORE") {
          navigate("/rmstore/dashboard");
        } else if (taskerRole === "SENIOR_RMT_STORE_AND_CYBER") {
          navigate("/rmstoreCyber/dashboard");
        } else if (taskerRole === "SENIOR_RMT_CYBER") {
          navigate("/rmcyber/dashboard");
        } else if (taskerRole === "RM_TASKER_JUNIOR") {
          navigate("/rmjunior/dashboard");
        } else {
          // fallback — no role set yet
          navigate("/tasker/dashboard");
        }
      } else if (admin.role === "MEDIA") {
        navigate("/media/dashboard");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <>
      {/* Bubble animation styles */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);   opacity: 0.15; }
          50%  { opacity: 0.25; }
          100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
        }
        .bubble {
          position: absolute;
          bottom: -120px;
          border-radius: 50%;
          background: #1e40af;
          animation: floatUp linear infinite;
        }
        .b1  { width:80px;  height:80px;  left:5%;   animation-duration:12s; animation-delay:0s;   background:#1d4ed8; }
        .b2  { width:50px;  height:50px;  left:15%;  animation-duration:9s;  animation-delay:2s;   background:#1e40af; }
        .b3  { width:120px; height:120px; left:25%;  animation-duration:15s; animation-delay:1s;   background:#1e3a8a; }
        .b4  { width:35px;  height:35px;  left:35%;  animation-duration:8s;  animation-delay:4s;   background:#1d4ed8; }
        .b5  { width:90px;  height:90px;  left:50%;  animation-duration:13s; animation-delay:0.5s; background:#1e40af; }
        .b6  { width:60px;  height:60px;  left:60%;  animation-duration:10s; animation-delay:3s;   background:#1e3a8a; }
        .b7  { width:140px; height:140px; left:70%;  animation-duration:17s; animation-delay:1.5s; background:#1d4ed8; }
        .b8  { width:45px;  height:45px;  left:80%;  animation-duration:9s;  animation-delay:5s;   background:#1e40af; }
        .b9  { width:70px;  height:70px;  left:88%;  animation-duration:11s; animation-delay:2.5s; background:#1e3a8a; }
        .b10 { width:30px;  height:30px;  left:42%;  animation-duration:7s;  animation-delay:6s;   background:#1d4ed8; }
        .b11 { width:100px; height:100px; left:93%;  animation-duration:14s; animation-delay:0.8s; background:#1e3a8a; }
        .b12 { width:55px;  height:55px;  left:8%;   animation-duration:10s; animation-delay:7s;   background:#1d4ed8; }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-6"
        style={{ background: "#bfdbfe" }}
      >
        {/* Bubbles */}
        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
        <div className="bubble b4" />
        <div className="bubble b5" />
        <div className="bubble b6" />
        <div className="bubble b7" />
        <div className="bubble b8" />
        <div className="bubble b9" />
        <div className="bubble b10" />
        <div className="bubble b11" />
        <div className="bubble b12" />

        {/* Card */}
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-[#1E3A8A] to-[#2563EB] px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-3">
                <Briefcase className="text-white" size={36} />
              </div>
              <h1 className="text-white text-2xl font-bold tracking-widest">
                RISEMOTIVE
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Building Skills. Delivering Solutions.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-widest">
                  STAFF PORTAL
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <h2 className="text-[#1E3A8A] text-xl font-bold mb-1">
                Welcome back
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Sign in to access your staff dashboard
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="you@risemotive.rw"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute cursor-pointer right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1e4fa8] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In →"
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Having trouble? Contact{" "}
                <a
                  href="mailto:tasks.risemotive@gmail.com"
                  className="text-[#1E3A8A] font-semibold hover:underline"
                >
                  tasks.risemotive@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          {/* <p className="text-center text-blue-400 text-xs mt-5 opacity-50">
            Rise Motive Ltd © 2025 — Staff Access Only
          </p> */}
        </div>
      </div>
    </>
  );
}
