import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-border">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
          <img src={logo} alt="" />
        </div>
        <span className="text-xl font-bold text-foreground">FloFrame</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/"
          className={`transition-colors ${
            isActive("/")
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}>
          Upload
        </Link>
        <Link
          to="/about"
          className={`transition-colors ${
            isActive("/about")
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}>
          About
        </Link>
        <Link
          to="/settings"
          className={`transition-colors ${
            isActive("/settings")
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}>
          Settings
        </Link>
      </div>
    </nav>
  );
};
