import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import * as shopAuthApi from "../services/shopAuthApi";

export default function SignIn() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState("password"); // "password" | "reset"
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const sendResetOtp = async () => {
    const m = String(mobile || "").trim();
    if (!m) return window.alert("Please enter your mobile number");

    try {
      setLoadingOtp(true);
      await shopAuthApi.shopSendOtp({ mobile: m, purpose: "RESET_PASSWORD" });
      setOtpSent(true);
      setMode("reset");
      window.alert("OTP has been sent to your WhatsApp");
    } catch (err) {
      window.alert(err?.data?.message || err?.message || "Failed to send OTP");
      console.error(err);
    } finally {
      setLoadingOtp(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const m = String(mobile || "").trim();
    if (!m) return window.alert("Please enter your mobile number");

    try {
      setLoadingSubmit(true);

      if (mode === "password") {
        const out = await shopAuthApi.shopLogin({ mobile: m, password });
        shopAuthApi.saveShopTokens(out);

        const from = (location.state && location.state.from) || "/account";
        navigate(from, { replace: true });
        return;
      }

      // reset mode
      const c = String(code || "").trim();
      const np = String(newPassword || "");

      if (!c) return window.alert("Please enter the OTP code");
      if (!np) return window.alert("Please enter your new password");

      await shopAuthApi.shopResetPassword({
        mobile: m,
        code: c,
        newPassword: np,
      });

      window.alert("Password changed successfully. You can now sign in.");

      setMode("password");
      setOtpSent(false);
      setCode("");
      setNewPassword("");
      setPassword("");
    } catch (err) {
      window.alert(err?.data?.message || err?.message || "Operation failed");
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="Sign In">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          {mode === "password" ? (
            <AuthInput
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : (
            <>
              <AuthInput
                placeholder="One-Time Password (OTP)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <AuthInput
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "password" ? "reset" : "password"));
                setOtpSent(false);
                setCode("");
                setNewPassword("");
              }}
              className="text-blue-600 text-[14px]"
            >
              {mode === "password"
                ? "Forgot your password?"
                : "Back to Sign In"}
            </button>

            <button
              type="button"
              onClick={sendResetOtp}
              disabled={loadingOtp}
              className="text-blue-600 text-[14px] disabled:opacity-60"
            >
              {loadingOtp
                ? "Sending..."
                : otpSent
                ? "Resend Code"
                : "Send Code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full mt-2 bg-[#2B4168] text-white rounded-[14px] py-5 text-[18px] disabled:opacity-60"
          >
            {loadingSubmit
              ? "Please wait..."
              : mode === "password"
              ? "Sign In"
              : "Change Password"}
          </button>

          <p className="text-center text-[16px] pt-2">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Sign Up
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
