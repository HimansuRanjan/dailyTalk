import { useEffect, useState } from 'react';
import Navbar from './sub-components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Blogs from './sub-components/Blogs';
import Footer from './sub-components/Footer';

interface User {
  username?: string;
  avatarUrl?: string;
  // Add more fields if your API returns them
}


const HomePage = () => {
  const [user, setUser] = useState<User>({});
  useEffect(()=>{
    const getMyProfile = async () =>{
      const {data} = await axios.get('http://localhost:4000/v.1/api/user/details/me', {
        withCredentials: true
      });
      setUser(data.user);
    };
    getMyProfile();

  })

  const navigateTo = useNavigate();

    const handleLogin = ()=>{
        navigateTo("/login");
    }

  return (
    <>
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <Navbar
        siteName="DailyTalk"
        userName={user.username} // omit to hide avatar/name
        userImage={user.avatarUrl}
        onClick={handleLogin}
        btnText="Login"
      />

      {/* spacer (same height as navbar) so content isn't hidden */}
      <div className="h-16" />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* middle blog container — white background with rounded corners */}
        <Blogs />
      </main>

    </div>
    <Footer/>
    </>
  );
};

export default HomePage;
