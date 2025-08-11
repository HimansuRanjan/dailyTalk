import ThemeToggle from "./ThemeToogle";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = ({ siteName, userName, userImage, onClick, btnText }: any) => {
    const navigateTo = useNavigate();

    const handleLogin = ()=>{
        navigateTo("/login");
    }
    const handleHome = ()=>{
        navigateTo("/");
    }
  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-neutral-950 shadow-sm z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
            <Link to="/profile">
                {userImage && (
            
            <img
              src={userImage}
              alt={userName || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
            </Link>
          
          {siteName && (
            <span className="font-medium text-gray-800 dark:text-gray-200" onClick={handleHome}>
              {siteName}
            </span>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onClick}
            variant="secondary"
          >
            {btnText}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
