import { useState, useRef, useEffect } from "react";
import { Layout } from "./Layout";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import {
  Bug,
  Loader2,
  Sparkles,
  FileCode,
  Upload,
  FileText,
  Download,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useLocation } from "react-router";

interface AIAgent {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

interface Issue {
  id: string;
  agent: string;
  severity: "critical" | "warning" | "info";
  line: number;
  title: string;
  description: string;
  oldCode: string;
  newCode: string;
}

interface AnalysisResult {
  code: string;
  highlights: { line: number; severity: "critical" | "warning" | "info" }[];
  issues: Issue[];
  metrics: {
    security: number;
    bugs: number;
    quality: number;
    improvements: number;
  };
}

export default function CodeAnalysisPage() {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (location.state && location.state.result) {
      setResult(location.state.result);
      if (location.state.result.code) {
        setCode(location.state.result.code);
      }
    }
  }, [location.state]);

  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: "bug",
      name: "Bug Detection",
      icon: <Bug className="w-4 h-4" />,
      enabled: true,
      description: "Find logical errors and bugs",
    },
    {
      id: "security",
      name: "Security Agent",
      icon: <ShieldAlert className="w-4 h-4" />,
      enabled: true,
      description: "Detect security vulnerabilities",
    },
    {
      id: "quality",
      name: "Code Quality",
      icon: <Sparkles className="w-4 h-4" />,
      enabled: true,
      description: "Analyze code quality & standards",
    },
    {
      id: "improvements",
      name: "Improvement Suggestions",
      icon: <Lightbulb className="w-4 h-4" />,
      enabled: true,
      description: "Get optimization suggestions",
    },
  ]);

  const toggleAgent = (id: string) => {
    setAgents(
      agents.map((agent) =>
        agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCode(text);
    };
    reader.readAsText(file);
  };

  const analyzeCode = async () => {
    setIsAnalyzing(true);

    try {
      const enabledAgents = agents.filter(a => a.enabled).map(a => a.name);
      const payload = {
        id: "ANALYSIS_" + Date.now(),
        code: code,
        AdditionalInformation: `fileName: ${fileName || "pasted_code.txt"}; agents: ${enabledAgents.join(", ")}`
      };

      const response = await fetch("http://localhost:8080/api/test/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const resultData = JSON.parse(text);

      if (resultData && typeof resultData === "object" && "issues" in resultData) {
        setResult(resultData);
      } else {
        throw new Error("Received invalid analysis result structure from backend.");
      }
    } catch (error: any) {
      console.error("Analysis failed:", error);
      alert("Analysis failed: " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };



  const resetAnalysis = () => {
    setResult(null);
    setCode("");
    setFileName("");
  };

  const getSeverityColor = (severity: "critical" | "warning" | "info") => {
    switch (severity) {
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 border-l-red-500";
      case "warning":
        return "bg-amber-100 dark:bg-amber-900/30 border-l-amber-500";
      case "info":
        return "bg-blue-100 dark:bg-blue-900/30 border-l-blue-500";
    }
  };

  const getSeverityBadge = (severity: "critical" | "warning" | "info") => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case "warning":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>;
    }
  };

  if (!result) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Code Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload or paste your code and select AI agents for comprehensive analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Code Input */}
            <Card className="border-green-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <FileCode className="w-5 h-5 text-green-600" />
                  Code Input
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Upload a file or paste your code for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your code here...
function example() {
  // Your code will be analyzed by AI agents
}"
                  className="font-mono text-sm min-h-[420px] bg-gray-50 dark:bg-gray-800 border-green-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus-visible:ring-green-500"
                />
              </CardContent>
            </Card>

            {/* AI Agent Selector */}
            <Card className="border-green-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Select AI Agents
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Choose which AI agents to run on your code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border transition-all ${
                        agent.enabled
                          ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                          : "bg-gray-50 dark:bg-gray-800 border-green-100 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg ${
                              agent.enabled
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                            }`}
                          >
                            {agent.icon}
                          </div>
                          <div className="flex-1">
                            <Label
                              className="text-gray-800 dark:text-white cursor-pointer font-medium"
                              htmlFor={agent.id}
                            >
                              {agent.name}
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {agent.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={agent.id}
                          checked={agent.enabled}
                          onCheckedChange={() => toggleAgent(agent.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-green-200 dark:bg-gray-700" />

                <Button
                  onClick={analyzeCode}
                  disabled={!code || isAnalyzing || !agents.some((a) => a.enabled)}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Code
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {agents.filter((a) => a.enabled).length} of {agents.length} agents
                  enabled
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Results View
  return (
    <Layout>
      <div className="container mx-auto px-6 py-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Analysis Results
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {fileName || "Code Analysis"} - Completed
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={resetAnalysis}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Security Issues
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {result.metrics.security}
                  </p>
                </div>
                <ShieldAlert className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bugs Detected
                  </p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {result.metrics.bugs}
                  </p>
                </div>
                <Bug className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quality Issues
                  </p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {result.metrics.quality}
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Improvements
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.metrics.improvements}
                  </p>
                </div>
                <Lightbulb className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Split View */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Viewer */}
          <Card className="border-green-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-green-600" />
                Code Review
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Lines highlighted by severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  {result.code.split("\n").map((line, index) => {
                    const lineNumber = index + 1;
                    const highlight = result.highlights.find(
                      (h) => h.line === lineNumber
                    );
                    return (
                      <div
                        key={index}
                        className={`flex gap-4 px-3 py-1 border-l-4 ${
                          highlight
                            ? getSeverityColor(highlight.severity)
                            : "border-transparent"
                        }`}
                      >
                        <span className="text-gray-400 dark:text-gray-500 select-none w-8 text-right">
                          {lineNumber}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {line || " "}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Issue Feed */}
          <Card className="border-green-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Issues Found ({result.issues.length})
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Detailed analysis from AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="single" collapsible className="space-y-3">
                  {result.issues.map((issue) => (
                    <AccordionItem
                      key={issue.id}
                      value={issue.id}
                      className="bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-start gap-3 text-left w-full">
                          <div className="mt-1">{getSeverityBadge(issue.severity)}</div>
                          <div className="flex-1">
                            <p className="text-gray-800 dark:text-white font-medium">
                              {issue.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {issue.agent} • Line {issue.line}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {issue.description}
                        </p>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500 dark:text-gray-400">
                            Before:
                          </Label>
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                            <pre className="text-xs text-red-700 dark:text-red-300 font-mono overflow-x-auto">
                              {issue.oldCode}
                            </pre>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500 dark:text-gray-400">
                            After (Suggested):
                          </Label>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                            <pre className="text-xs text-green-700 dark:text-green-300 font-mono overflow-x-auto">
                              {issue.newCode}
                            </pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
