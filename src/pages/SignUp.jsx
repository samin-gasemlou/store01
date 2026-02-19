import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import * as shopAuthApi from "../services/shopAuthApi";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();

    const fullName1 = String(fullName || "").trim();
    const mobile1 = String(mobile || "").trim();
    const pass1 = String(password || "");

    if (!fullName1)
      return window.alert("Full name is required");
    if (!mobile1)
      return window.alert("Mobile number is required");
    if (!pass1)
      return window.alert("Password is required");

    try {
      setLoadingSubmit(true);

      const out = await shopAuthApi.shopRegister({
        fullName: fullName1,
        mobile: mobile1,
        password: pass1,
      });

      shopAuthApi.saveShopTokens(out);

      const from = (location.state && location.state.from) || "/account";
      navigate(from, { replace: true });
    } catch (err) {
      window.alert(
        err?.data?.message || err?.message || "Registration failed"
      );
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="Sign Up">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <AuthInput
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <AuthInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full mt-2 bg-[#2B4168] text-white rounded-[14px] py-5 text-[18px] disabled:opacity-60"
          >
            {loadingSubmit ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-[16px] pt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600">
              Sign In
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
