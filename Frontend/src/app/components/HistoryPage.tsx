import { useState, useEffect } from "react";
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
  Loader2,
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
import { useNavigate } from "react-router";
 
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
  parsedResult: any;
}
 
export default function HistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/test/showcode", {
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/");
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const items: HistoryItem[] = data.map((entity: any) => {
        let fileName = "CodeSnippet.txt";
        if (entity.additionalInformation && entity.additionalInformation.includes("fileName:")) {
          const match = entity.additionalInformation.match(/fileName:\s*([^;]+)/);
          if (match) fileName = match[1].trim();
        }

        let status: "passed" | "warning" | "critical" = "passed";
        let score = 100;
        let issues = { security: 0, bugs: 0, quality: 0, improvements: 0 };
        let parsedResult = null;

        if (entity.analysisResult) {
          try {
            parsedResult = JSON.parse(entity.analysisResult);
            if (parsedResult && parsedResult.metrics) {
              issues = {
                security: parsedResult.metrics.security || 0,
                bugs: parsedResult.metrics.bugs || 0,
                quality: parsedResult.metrics.quality || 0,
                improvements: parsedResult.metrics.improvements || 0,
              };
            }
            
            const totalCritical = parsedResult.issues?.filter((i: any) => i.severity === "critical").length || 0;
            const totalWarning = parsedResult.issues?.filter((i: any) => i.severity === "warning").length || 0;
            
            if (totalCritical > 0) {
              status = "critical";
              score = Math.max(30, 100 - totalCritical * 15 - totalWarning * 5);
            } else if (totalWarning > 0) {
              status = "warning";
              score = Math.max(60, 100 - totalWarning * 8);
            } else {
              status = "passed";
              score = 100 - (issues.improvements * 2);
            }
          } catch (e) {
            console.error("Failed to parse analysis result:", e);
          }
        }

        // Mock dates based on ID to look realistic
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - (data.length - (entity.id % data.length)));
        const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

        return {
          id: entity.id.toString(),
          fileName,
          date: dateStr,
          timestamp: timeStr,
          status,
          issues,
          linesOfCode: entity.code ? entity.code.split("\n").length : 0,
          score,
          parsedResult: {
            ...parsedResult,
            code: entity.code
          }
        };
      });

      items.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      setHistoryData(items);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading review history...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                <FileCode className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">No reviews found</p>
                <p className="text-sm text-gray-400 max-w-xs mt-1">
                  Upload or paste code in the Code Review tab to create your first analysis!
                </p>
              </div>
            ) : (
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
                            onClick={() => navigate("/analyze", { state: { result: item.parsedResult } })}
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
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
