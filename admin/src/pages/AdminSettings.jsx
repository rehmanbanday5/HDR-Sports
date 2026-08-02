import api from "../api/client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";



const AdminSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  
useEffect(() => {
  const getAdmin = async () => {
    try {
      const { data } = await api.get("/auth/me");

      setProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  getAdmin();
}, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/auth/update-profile", profile);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      await api.put("/auth/update-password", password);
      toast.success("Password changed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-3xl font-bold">HDR Sports Settings</h1>

      <div className="bg-white p-6 border rounded">
        <h2 className="font-bold mb-4">Profile Information</h2>

        <form onSubmit={updateProfile} className="space-y-3">
          <input
            placeholder="Name"
            className="w-full border p-3"
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="w-full border p-3"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <input
            placeholder="Phone"
            className="w-full border p-3"
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />

          <button className="bg-black text-white px-5 py-3 hover:bg-[#D4AF37]">
            Save Profile
          </button>
        </form>
      </div>

      <div className="bg-white p-6 border rounded">
        <h2 className="font-bold mb-4">Change Password</h2>

        <form onSubmit={changePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border p-3"
            onChange={(e) =>
              setPassword({
                ...password,
                currentPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3"
            onChange={(e) =>
              setPassword({
                ...password,
                newPassword: e.target.value,
              })
            }
          />

          <button className="bg-black text-white px-5 py-3 hover:bg-[#D4AF37]">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
