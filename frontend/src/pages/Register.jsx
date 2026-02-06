import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/auth";
import { register as registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const res = await registerUser(values);

      if (!res || res.statusCode !== 201) {
        toast.error(res?.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 text-slate-200">
      <div className="w-full max-w-md bg-slate-800/50 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-sm">

        {/* Header */}
        <div className="p-8 text-center border-b border-slate-800/50">
          <div className="mb-4 flex justify-center items-center gap-2">
            <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#0f172a]"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">BinBot</span>
          </div>

          <h2 className="text-2xl font-semibold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Smart waste segregation starts here.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                {...register("username")}
                placeholder="johndoe"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50"
              />
              {errors.username && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-[#0f172a] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-500 hover:text-emerald-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
