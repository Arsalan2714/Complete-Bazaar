import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Security = () => {
    const { token, firstName: reduxName } = useSelector((state) => state.auth);
    const firstName = reduxName || localStorage.getItem("firstName");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Change password state
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwMsg, setPwMsg] = useState({ text: "", type: "" });
    const [pwLoading, setPwLoading] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteMsg, setDeleteMsg] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwMsg({ text: "", type: "" });

        if (pwForm.newPassword.length < 8) {
            setPwMsg({ text: "New password must be at least 8 characters", type: "error" });
            return;
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwMsg({ text: "New passwords do not match", type: "error" });
            return;
        }
        if (pwForm.currentPassword === pwForm.newPassword) {
            setPwMsg({ text: "New password must be different from current password", type: "error" });
            return;
        }

        setPwLoading(true);
        try {
            const res = await fetch("http://localhost:3001/api/customer/change-password", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setPwMsg({ text: "Password changed successfully!", type: "success" });
                setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setPwMsg({ text: data.error || "Failed to change password", type: "error" });
            }
        } catch {
            setPwMsg({ text: "Something went wrong", type: "error" });
        }
        setPwLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setDeleteMsg("Please enter your password");
            return;
        }
        setDeleteLoading(true);
        setDeleteMsg("");
        try {
            const res = await fetch("http://localhost:3001/api/customer/delete-account", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(logout());
                navigate("/");
            } else {
                setDeleteMsg(data.error || "Failed to delete account");
            }
        } catch {
            setDeleteMsg("Something went wrong");
        }
        setDeleteLoading(false);
    };

    const inputClass = "w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

    const EyeButton = ({ show, toggle }) => (
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 cursor-pointer">
            {show ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate("/profile")} className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">Login & Security</h1>
                        <p className="text-slate-400 mt-0.5">Manage your password and account security</p>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-100">Change Password</h2>
                    </div>

                    {pwMsg.text && (
                        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${pwMsg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                            {pwMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPw ? "text" : "password"}
                                    value={pwForm.currentPassword}
                                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                    className={inputClass}
                                    placeholder="Enter current password"
                                    required
                                />
                                <EyeButton show={showCurrentPw} toggle={() => setShowCurrentPw(!showCurrentPw)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPw ? "text" : "password"}
                                    value={pwForm.newPassword}
                                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                    className={inputClass}
                                    placeholder="Enter new password (min. 8 characters)"
                                    required
                                    minLength={8}
                                />
                                <EyeButton show={showNewPw} toggle={() => setShowNewPw(!showNewPw)} />
                            </div>
                            {/* Password strength indicator */}
                            {pwForm.newPassword && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((i) => {
                                            const strength = pwForm.newPassword.length >= 12 && /[A-Z]/.test(pwForm.newPassword) && /[0-9]/.test(pwForm.newPassword) && /[^A-Za-z0-9]/.test(pwForm.newPassword) ? 4
                                                : pwForm.newPassword.length >= 10 && (/[A-Z]/.test(pwForm.newPassword) || /[0-9]/.test(pwForm.newPassword)) ? 3
                                                    : pwForm.newPassword.length >= 8 ? 2 : 1;
                                            const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
                                            return <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? colors[strength - 1] : "bg-slate-700"}`} />;
                                        })}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {pwForm.newPassword.length < 8 ? "Too short" : pwForm.newPassword.length >= 12 && /[A-Z]/.test(pwForm.newPassword) && /[0-9]/.test(pwForm.newPassword) && /[^A-Za-z0-9]/.test(pwForm.newPassword) ? "Strong 💪" : pwForm.newPassword.length >= 10 ? "Good" : "Fair"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                value={pwForm.confirmPassword}
                                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                className={inputClass}
                                placeholder="Re-enter new password"
                                required
                            />
                            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={pwLoading || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {pwLoading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>

                {/* Account Info */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-100">Account Security</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/20 border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">Password</p>
                                    <p className="text-xs text-slate-500">Last updated with your account</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/20 border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">Email Verification</p>
                                    <p className="text-xs text-slate-500">Your email is verified via OTP</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/20 border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">Active Session</p>
                                    <p className="text-xs text-slate-500">Currently logged in as {firstName || "User"}</p>
                                </div>
                            </div>
                            <button onClick={() => { dispatch(logout()); navigate("/"); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete Account */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-red-400">Delete Account</h2>
                            <p className="text-sm text-slate-500">This action is permanent and cannot be undone</p>
                        </div>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                            Delete My Account
                        </button>
                    ) : (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
                            <p className="text-sm text-slate-300">
                                ⚠️ This will permanently delete your account, orders, reviews, and all associated data. Enter your password to confirm.
                            </p>
                            {deleteMsg && <p className="text-red-400 text-sm">{deleteMsg}</p>}
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className={inputClass}
                                placeholder="Enter your password to confirm"
                            />
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading}
                                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {deleteLoading ? "Deleting..." : "Permanently Delete"}
                                </button>
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeleteMsg(""); }}
                                    className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Security;
