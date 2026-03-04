import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";

const SellerLogin = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const emailVal = emailRef.current.value.trim();
        const password = passwordRef.current.value;

        if (!emailVal || !password) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3001/api/auth/login/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailVal, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.errorMessages || "Login failed.");
                setLoading(false);
                return;
            }
            setEmail(emailVal);
            setSuccess("OTP sent to your email! Check your inbox.");
            setStep(2);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp.trim() || otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3001/api/auth/login/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otp.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.errorMessages || "Verification failed.");
                setLoading(false);
                return;
            }
            if (data.userType !== "seller") {
                setError("This login is for seller accounts only. Please use the customer login.");
                setLoading(false);
                return;
            }
            dispatch(login(data));
            navigate("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const handleResendOtp = async () => {
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const password = passwordRef.current?.value || "";
            const res = await fetch("http://localhost:3001/api/auth/login/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("New OTP sent to your email!");
            } else {
                setError(data.errorMessages || "Failed to resend OTP.");
            }
        } catch (err) {
            setError("Failed to resend. Please try again.");
        }
        setLoading(false);
    };

    const inputClasses =
        "w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200";

    const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        {step === 1 ? "Seller Login" : "Verify Login"}
                    </h1>
                    <p className="text-slate-400 mt-2">
                        {step === 1
                            ? "Sign in to your Complete Bazaar seller account"
                            : "Enter the OTP sent to your email"}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 1
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}>
                        {step > 1 ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
                        )}
                        Credentials
                    </div>
                    <div className="w-8 h-px bg-slate-600"></div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 2
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-700/50 text-slate-500 border border-slate-700"
                        }`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 2 ? "bg-amber-500 text-white" : "bg-slate-700 text-slate-500"
                            }`}>2</span>
                        Verify
                    </div>
                </div>

                {/* Seller Badge */}
                <div className="flex items-center justify-center mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                        🏪 Seller Portal
                    </span>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={step === 1 ? handleSendOtp : handleVerify}
                    className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 space-y-5"
                >
                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {Array.isArray(error) ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {error.map((msg, i) => (<li key={i}>{msg}</li>))}
                                </ul>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {success}
                            </div>
                        </div>
                    )}

                    {step === 1 ? (
                        <>
                            {/* Email */}
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input type="email" placeholder="seller@example.com" ref={emailRef} className={`${inputClasses} pl-10`} />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    <Link to="/forgot-password" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        ref={passwordRef}
                                        className={`${inputClasses} pl-10 pr-10`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* OTP Step */}
                            <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-700 text-sm">
                                <span className="text-slate-500">OTP sent to: </span>
                                <span className="text-amber-400 font-medium">{email}</span>
                            </div>

                            <div>
                                <label className={labelClasses}>Enter OTP</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        maxLength={6}
                                        className={`${inputClasses} pl-10 tracking-[0.3em] text-center text-lg font-semibold`}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="text-sm text-amber-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Didn't receive OTP? Resend
                            </button>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold text-lg shadow-lg hover:shadow-amber-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {step === 1 ? "Sending OTP..." : "Verifying..."}
                            </span>
                        ) : (
                            step === 1 ? "Sign In" : "Verify & Login"
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-800/60 text-slate-400">
                                New to selling?
                            </span>
                        </div>
                    </div>

                    {/* Signup Link */}
                    <Link
                        to="/seller/signup"
                        className="block w-full text-center py-2.5 px-6 rounded-lg border border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-500/50 hover:bg-amber-500/10 font-medium transition-all duration-200"
                    >
                        Create a seller account
                    </Link>

                    {/* Customer Login Link */}
                    <div className="text-center">
                        <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                            Looking to shop? Login as a customer →
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerLogin;
