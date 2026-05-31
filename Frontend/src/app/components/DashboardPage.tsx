import { Layout } from "./Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  TrendingDown,
  FileCode,
  Bug,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Activity,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Analyses",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: FileCode,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Bugs Detected",
      value: "1,429",
      change: "-8%",
      trend: "down",
      icon: Bug,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Security Issues",
      value: "89",
      change: "-15%",
      trend: "down",
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Code Quality Score",
      value: "8.4/10",
      change: "+2.1",
      trend: "up",
      icon: Sparkles,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  const recentActivity = [
    {
      file: "UserAuthService.java",
      date: "2 hours ago",
      status: "passed",
      issues: 2,
      severity: "low",
    },
    {
      file: "PaymentController.java",
      date: "5 hours ago",
      status: "warning",
      issues: 7,
      severity: "medium",
    },
    {
      file: "DatabaseConfig.java",
      date: "1 day ago",
      status: "critical",
      issues: 3,
      severity: "high",
    },
    {
      file: "ApiClient.ts",
      date: "1 day ago",
      status: "passed",
      issues: 1,
      severity: "low",
    },
    {
      file: "ValidationUtils.java",
      date: "2 days ago",
      status: "passed",
      issues: 0,
      severity: "none",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500 hover:bg-green-600">Passed</Badge>;
      case "warning":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Warning</Badge>;
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your code analysis activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="border-green-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-green-100 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    <Activity className="w-5 h-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Your latest code reviews and analyses
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/history")}
                  className="text-green-600 hover:text-green-700 dark:text-green-400"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => navigate("/history")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white dark:bg-gray-700 p-2 rounded-lg border border-green-100 dark:border-gray-600">
                        <FileCode className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {activity.file}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.date} • {activity.issues} issue{activity.issues !== 1 ? "s" : ""} found
                        </p>
                      </div>
                    </div>
                    <div>{getStatusBadge(activity.status)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-green-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">Quick Actions</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Start analyzing your code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate("/analyze")}
                className="w-full justify-start h-auto py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode className="w-5 h-5" />
                    <span className="font-semibold">New Code Review</span>
                  </div>
                  <p className="text-xs opacity-90">
                    Upload or paste code for AI analysis
                  </p>
                </div>
              </Button>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Multi-Agent Analysis
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Choose AI agents for your review
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Detailed Reports
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Export analysis as PDF
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <AlertTriangle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Real-time Insights
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get instant feedback on issues
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
