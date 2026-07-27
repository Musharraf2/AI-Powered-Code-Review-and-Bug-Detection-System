import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Code2, ShieldCheck, Bug, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-xl shadow-green-500/30">
              <Code2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            AI Code Reviewer
          </h1>
          <p className="text-gray-600 mt-2">
            Intelligent bug detection and code analysis powered by AI
          </p>
        </div>

        <Card className="shadow-2xl shadow-green-500/10 border-green-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to access your AI-powered code reviewer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-12 text-base bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-green-300 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Features</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Bug className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Bug Detection</p>
                  <p className="text-xs text-gray-600">
                    AI-powered identification of potential issues
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Security Analysis
                  </p>
                  <p className="text-xs text-gray-600">
                    Detect vulnerabilities and security risks
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Code Quality Insights
                  </p>
                  <p className="text-xs text-gray-600">
                    Get detailed analysis and improvement suggestions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Zap className="w-3 h-3 text-green-500" />
          <p>Powered by LangChain & Spring Boot</p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
