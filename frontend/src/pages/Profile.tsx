import { useEffect, useState } from "react";
import Navbar from "./sub-components/Navbar";
import axios from "axios";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

interface User {
  username?: string;
  avatarUrl?: string;
  aboutMe?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/v.1/api/user/details/me",
          { withCredentials: true },
        );
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    getMyProfile();
  }, []);

  const navigateTo = useNavigate();

  const handleGoBack = () => {
    navigateTo("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Navbar */}
      <Navbar
        siteName="DailyTalk"
        userName={user.username}
        userImage={user.avatarUrl}
        onClick={handleGoBack}
        btnText="Go Back"
      />
      <div className="h-16" /> {/* Spacer below navbar */}
      {/* Profile content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center gap-8 rounded-lg bg-white p-6 shadow dark:bg-neutral-900 sm:flex-row sm:items-start">
          {/* Left side: avatar */}
          <img
            src={user.avatarUrl || "/images/avatar-placeholder.png"}
            alt={user.username}
            className="h-40 w-40 rounded-full border-4 border-gray-200 object-cover dark:border-gray-700"
          />

          {/* Right side: name, about, portfolio */}
          <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.username || "Unnamed User"}
            </h1>
            <p className="max-w-md text-gray-700 dark:text-gray-300">
              {user.aboutMe || "This user has not added an about section yet."}
            </p>
            <a
              href="https://himansu-ranjan-profile.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Portfolio
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
