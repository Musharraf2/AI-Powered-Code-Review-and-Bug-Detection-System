import { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Clock,
  FileCode,
  Search,
  Calendar,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  timestamp: string;
  status: "passed" | "warning" | "critical";
  issues: {
    security: number;
    bugs: number;
    quality: number;
    improvements: number;
  };
  linesOfCode: number;
  score: number;
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const historyData: HistoryItem[] = [
    {
      id: "1",
      fileName: "UserAuthService.java",
      date: "May 31, 2026",
      timestamp: "2:45 PM",
      status: "passed",
      issues: { security: 0, bugs: 2, quality: 1, improvements: 3 },
      linesOfCode: 245,
      score: 87,
    },
    {
      id: "2",
      fileName: "PaymentController.java",
      date: "May 31, 2026",
      timestamp: "11:20 AM",
      status: "warning",
      issues: { security: 2, bugs: 3, quality: 4, improvements: 5 },
      linesOfCode: 412,
      score: 68,
    },
    {
      id: "3",
      fileName: "DatabaseConfig.java",
      date: "May 30, 2026",
      timestamp: "4:15 PM",
      status: "critical",
      issues: { security: 5, bugs: 2, quality: 3, improvements: 2 },
      linesOfCode: 156,
      score: 52,
    },
    {
      id: "4",
      fileName: "ApiClient.ts",
      date: "May 30, 2026",
      timestamp: "10:30 AM",
      status: "passed",
      issues: { security: 0, bugs: 1, quality: 2, improvements: 4 },
      linesOfCode: 328,
      score: 91,
    },
    {
      id: "5",
      fileName: "ValidationUtils.java",
      date: "May 29, 2026",
      timestamp: "3:00 PM",
      status: "passed",
      issues: { security: 0, bugs: 0, quality: 1, improvements: 2 },
      linesOfCode: 189,
      score: 95,
    },
    {
      id: "6",
      fileName: "EmailService.java",
      date: "May 29, 2026",
      timestamp: "9:45 AM",
      status: "warning",
      issues: { security: 1, bugs: 4, quality: 3, improvements: 3 },
      linesOfCode: 267,
      score: 72,
    },
    {
      id: "7",
      fileName: "SecurityFilter.java",
      date: "May 28, 2026",
      timestamp: "5:20 PM",
      status: "critical",
      issues: { security: 8, bugs: 2, quality: 2, improvements: 1 },
      linesOfCode: 198,
      score: 45,
    },
    {
      id: "8",
      fileName: "UserRepository.java",
      date: "May 28, 2026",
      timestamp: "2:10 PM",
      status: "passed",
      issues: { security: 0, bugs: 1, quality: 1, improvements: 5 },
      linesOfCode: 134,
      score: 89,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Passed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            Warning
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Critical
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch = item.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-green-600" />
            Analysis History
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your past code reviews
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-green-100 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by file name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-200 dark:border-gray-600 focus-visible:ring-green-500"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-green-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter: {filterStatus === "all" ? "All" : filterStatus}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Statuses
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="passed">
                      Passed
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="warning">
                      Warning
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="critical">
                      Critical
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                Showing {filteredHistory.length} of {historyData.length} results
              </span>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="border-green-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">
              Review History
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              All your code analysis results in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <Card
                    key={item.id}
                    className="border-green-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                            <FileCode className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                              {item.fileName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.date} at {item.timestamp} • {item.linesOfCode} lines
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(item.status)}
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Score
                            </p>
                            <p
                              className={`text-xl font-bold ${getScoreColor(
                                item.score
                              )}`}
                            >
                              {item.score}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Security
                          </p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {item.issues.security}
                          </p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Bugs
                          </p>
                          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {item.issues.bugs}
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Quality
                          </p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {item.issues.quality}
                          </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Improvements
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {item.issues.improvements}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-green-200 dark:border-gray-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-green-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
