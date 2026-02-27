import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/auth";
import { register as registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { Recycle } from "lucide-react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      toast.info("You were logged out. Please register again.");
    }
  }, []);

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
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070915] flex items-center justify-center p-4 text-[#FAFAF9] relative overflow-hidden">
      
      {/* 1. Page Background - Premium Atmosphere */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#674E98]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#917FBA]/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* 2. Register Card - Glass Morphism Premium Panel */}
      <div className="relative w-full max-w-md bg-[#25233F]/60 border border-[#44356F]/60 rounded-3xl shadow-[0_20px_60px_rgba(7,9,21,0.8)] backdrop-blur-xl ring-1 ring-[#FAFAF9]/5 overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#674E98]/5 to-transparent pointer-events-none" />

        {/* 3. Logo Area - Brand Identity Enhancement */}
        <div className="p-8 pb-6 text-center border-b border-[#44356F]/40 relative z-10">
          <div className="mb-5 flex justify-center items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#674E98] to-[#44356F] rounded-xl flex items-center justify-center text-[#FAFAF9] shadow-[0_0_15px_rgba(103,78,152,0.4)] ring-1 ring-[#917FBA]/30 hover:scale-105 transition-transform duration-300">
              <Recycle size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-sm">BinBot</span>
          </div>

          <h2 className="text-2xl font-bold text-[#FAFAF9] tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm font-medium text-[#ACA7B6]">
            Smart waste segregation starts here.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6 relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Username */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#917FBA] mb-1.5 ml-1 transition-colors group-focus-within:text-[#D3B4D2]">Username</label>
              <input
                type="text"
                {...register("username")}
                autoComplete="username"
                placeholder="johndoe"
                aria-invalid={Boolean(errors.username)}
                className="w-full px-4 py-3 bg-[#070915]/50 border border-[#44356F] rounded-xl outline-none text-[#FAFAF9] placeholder:text-[#ACA7B6]/60 transition-all duration-300 focus:ring-2 focus:ring-[#674E98]/40 focus:border-[#917FBA] hover:border-[#674E98] shadow-inner"
              />
              {errors.username && (
                <p className="text-[13px] font-medium text-[#D3B4D2] mt-1.5 ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#917FBA] mb-1.5 ml-1 transition-colors group-focus-within:text-[#D3B4D2]">Email</label>
              <input
                type="email"
                {...register("email")}
                autoComplete="email"
                placeholder="name@company.com"
                aria-invalid={Boolean(errors.email)}
                className="w-full px-4 py-3 bg-[#070915]/50 border border-[#44356F] rounded-xl outline-none text-[#FAFAF9] placeholder:text-[#ACA7B6]/60 transition-all duration-300 focus:ring-2 focus:ring-[#674E98]/40 focus:border-[#917FBA] hover:border-[#674E98] shadow-inner"
              />
              {errors.email && (
                <p className="text-[13px] font-medium text-[#D3B4D2] mt-1.5 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#917FBA] mb-1.5 ml-1 transition-colors group-focus-within:text-[#D3B4D2]">Password</label>
              <input
                type="password"
                {...register("password")}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                className="w-full px-4 py-3 bg-[#070915]/50 border border-[#44356F] rounded-xl outline-none text-[#FAFAF9] placeholder:text-[#ACA7B6]/60 transition-all duration-300 focus:ring-2 focus:ring-[#674E98]/40 focus:border-[#917FBA] hover:border-[#674E98] shadow-inner tracking-widest"
              />
              {errors.password && (
                <p className="text-[13px] font-medium text-[#D3B4D2] mt-1.5 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#917FBA] mb-1.5 ml-1 transition-colors group-focus-within:text-[#D3B4D2]">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.confirmPassword)}
                className="w-full px-4 py-3 bg-[#070915]/50 border border-[#44356F] rounded-xl outline-none text-[#FAFAF9] placeholder:text-[#ACA7B6]/60 transition-all duration-300 focus:ring-2 focus:ring-[#674E98]/40 focus:border-[#917FBA] hover:border-[#674E98] shadow-inner tracking-widest"
              />
              {errors.confirmPassword && (
                <p className="text-[13px] font-medium text-[#D3B4D2] mt-1.5 ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-[15px] text-[#070915] bg-gradient-to-r from-[#674E98] to-[#917FBA] transition-all duration-300 ease-out active:scale-[0.98] hover:from-[#917FBA] hover:to-[#D3B4D2] hover:shadow-[0_0_25px_rgba(145,127,186,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ring-1 ring-[#FAFAF9]/10"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm font-medium text-[#ACA7B6]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#917FBA] hover:text-[#D3B4D2] transition-colors duration-200 font-bold ml-1 hover:underline underline-offset-4"
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