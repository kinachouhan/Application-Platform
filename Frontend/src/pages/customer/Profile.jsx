import { useState } from "react";
import { useSelector } from "react-redux";

export const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile] = useState(user);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">My Profile</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 font-semibold">Name</p>
            <p className="text-gray-800">{profile?.name}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Email</p>
            <p className="text-gray-800">{profile?.email}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Role</p>
            <p className="text-gray-800 capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
