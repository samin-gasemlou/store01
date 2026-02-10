import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // TODO: connect to api
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="Sign Up">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <AuthInput
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <div className="pt-2">
            <Link to="/forgot" className="text-blue-600 text-[18px]">
              Forget Password?
            </Link>
          </div>

          <button
            type="submit"
            className="
              w-full
              mt-2
              bg-[#2B4168]
              text-white
              rounded-[14px]
              py-5
              text-[20px]
            "
          >
            Sing in
          </button>

          <p className="text-center text-[18px] pt-2">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-blue-600">
              Sign Up
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
