import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Code2, LogOut, Moon, Sun, Home, Clock, FileCode } from "lucide-react";
import { useTheme } from "next-themes";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    window.location.href = "http://localhost:8080/logout";
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/analyze", label: "Code Review", icon: FileCode },
    { path: "/history", label: "History", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-green-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-lg">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AI Code Reviewer
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by LangChain & Spring Boot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={
                    isActive
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-600 dark:text-gray-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
