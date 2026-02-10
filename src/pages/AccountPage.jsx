import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function AccountPage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated successfully");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert("Password changed successfully");
    setPassword({ current: "", new: "" });
  };

  const logout = () => {
    alert("Logged out");
  };

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-7xl px-4 py-10 mb-20">
        <h1 className="text-xl font-semibold text-center mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* PROFILE INFO */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Profile Information</h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder="Full Name"
              />

              <input
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder="Email"
              />

              <button className="w-full bg-[#2b41682a] py-2 rounded-lg font-medium">
                Save Changes
              </button>
            </form>
          </div>

          {/* PASSWORD */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Change Password</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder="Current Password"
              />

              <input
                type="password"
                value={password.new}
                onChange={(e) =>
                  setPassword({ ...password, new: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder="New Password"
              />

              <button className="w-full bg-[#2b41682a] py-2 rounded-lg font-medium">
                Update Password
              </button>
            </form>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold mb-4">My Orders</h2>

              <p className="text-sm text-gray-500 mb-6">
                You haven't placed any orders yet.
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full border border-[#2B4168] text-[#2B4168] py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </section>
  );
}
