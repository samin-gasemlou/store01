import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import CitySelect from "../components/auth/CitySelect";
import { cities } from "../data/cities";

export default function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // TODO: connect to api
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="Sign in">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <CitySelect value={city} onChange={setCity} options={cities} />

          <AuthInput
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

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
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
