import { useState, useRef } from "react";
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
  Code2,
  Bug,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LogOut,
  Sparkles,
  FileCode,
  Shield,
  Upload,
  FileText,
  Download,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router";

interface AIAgent {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
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

export default function CodeReviewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [agents, setAgents] = useState<AIAgent[]>([
    { id: "bug", name: "Bug Detection", icon: <Bug className="w-4 h-4" />, enabled: true },
    { id: "security", name: "Security Agent", icon: <ShieldAlert className="w-4 h-4" />, enabled: true },
    { id: "quality", name: "Code Quality", icon: <Sparkles className="w-4 h-4" />, enabled: true },
    { id: "improvements", name: "Improvement Suggestions", icon: <Lightbulb className="w-4 h-4" />, enabled: true },
  ]);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleAgent = (id: string) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
    ));
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

    // Mock API call - replace with actual Spring Boot API endpoint
    // const enabledAgents = agents.filter(a => a.enabled).map(a => a.id);
    // const response = await fetch('http://localhost:8080/api/analyze', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code, agents: enabledAgents })
    // });

    setTimeout(() => {
      const mockResult: AnalysisResult = {
        code,
        highlights: [
          { line: 3, severity: "critical" },
          { line: 7, severity: "warning" },
          { line: 12, severity: "info" },
        ],
        issues: [
          {
            id: "1",
            agent: "Security Agent",
            severity: "critical",
            line: 3,
            title: "Potential SQL Injection",
            description: "Direct string concatenation in SQL query allows SQL injection attacks. User input should be sanitized and parameterized queries should be used.",
            oldCode: 'query = "SELECT * FROM users WHERE id = " + userId;',
            newCode: 'PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");\nstmt.setInt(1, userId);',
          },
          {
            id: "2",
            agent: "Bug Detection",
            severity: "warning",
            line: 7,
            title: "Null Pointer Exception Risk",
            description: "Accessing object property without null check may cause NullPointerException at runtime.",
            oldCode: 'String name = user.getName();',
            newCode: 'String name = user != null ? user.getName() : "Unknown";',
          },
          {
            id: "3",
            agent: "Code Quality",
            severity: "warning",
            line: 12,
            title: "Code Smell: Long Method",
            description: "This method has too many responsibilities. Consider breaking it down into smaller, focused methods for better maintainability.",
            oldCode: '// Complex method with 50+ lines',
            newCode: '// Refactored into 3 smaller methods:\n// - validateInput()\n// - processData()\n// - handleResponse()',
          },
          {
            id: "4",
            agent: "Improvement Suggestions",
            severity: "info",
            line: 15,
            title: "Use Modern Syntax",
            description: "Consider using enhanced for-loop or Stream API for better readability and performance.",
            oldCode: 'for (int i = 0; i < list.size(); i++) {\n  process(list.get(i));\n}',
            newCode: 'list.forEach(item -> process(item));',
          },
        ],
        metrics: {
          security: 3,
          bugs: 1,
          quality: 2,
          improvements: 5,
        },
      };

      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const exportToPDF = () => {
    // Mock PDF export - replace with actual Spring Boot endpoint
    // fetch('http://localhost:8080/api/export-pdf', {
    //   method: 'POST',
    //   body: JSON.stringify(result)
    // }).then(response => response.blob())
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'code-review.pdf';
    //     a.click();
    //   });
    console.log("Exporting to PDF...");
    alert("PDF export feature will be connected to Spring Boot backend");
  };

  const getSeverityColor = (severity: "critical" | "warning" | "info") => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 border-red-500";
      case "warning":
        return "bg-yellow-500/20 border-yellow-500";
      case "info":
        return "bg-blue-500/20 border-blue-500";
    }
  };

  const getSeverityBadge = (severity: "critical" | "warning" | "info") => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>;
    }
  };

  if (!result) {
    // Dashboard/Setup View
    return (
      <div className="min-h-screen bg-[#1a1a2e] dark">
        {/* Header */}
        <header className="border-b border-gray-800 bg-[#16213e]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2.5 rounded-xl">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Code Reviewer</h1>
                <p className="text-xs text-gray-400">Powered by LangChain & Spring Boot</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                History
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Settings
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-300 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Left: Code Input */}
            <Card className="bg-[#0f3460] border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  Code Input
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a file or paste your code for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="paste" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#16213e]">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="paste" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                      <FileText className="w-4 h-4 mr-2" />
                      Paste Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-6">
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                        dragActive
                          ? "border-cyan-400 bg-cyan-500/10"
                          : "border-gray-600 hover:border-cyan-500/50"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-white mb-2">
                        {fileName ? fileName : "Drop your code file here"}
                      </p>
                      <p className="text-sm text-gray-400">
                        or click to browse
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".js,.jsx,.ts,.tsx,.java,.py,.cpp,.c,.cs"
                        onChange={handleFileInput}
                      />
                    </div>
                    {code && (
                      <div className="mt-4 p-4 bg-[#16213e] rounded-lg border border-gray-700">
                        <ScrollArea className="h-[300px]">
                          <pre className="text-xs text-gray-300 font-mono">{code}</pre>
                        </ScrollArea>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paste" className="mt-6">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="// Paste your code here...
function example() {
  // Your code will be analyzed by AI agents
}"
                      className="font-mono text-sm min-h-[400px] bg-[#16213e] border-gray-700 text-gray-300 placeholder:text-gray-600"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Right: AI Agent Selector */}
            <Card className="bg-[#0f3460] border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Select Agents
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose which AI agents to run on your code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border transition-all ${
                        agent.enabled
                          ? "bg-cyan-500/10 border-cyan-500/50"
                          : "bg-[#16213e] border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            agent.enabled ? "bg-cyan-500/20" : "bg-gray-700"
                          }`}>
                            {agent.icon}
                          </div>
                          <Label className="text-white cursor-pointer" htmlFor={agent.id}>
                            {agent.name}
                          </Label>
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

                <Separator className="bg-gray-700" />

                <Button
                  onClick={analyzeCode}
                  disabled={!code || isAnalyzing || !agents.some(a => a.enabled)}
                  className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg shadow-cyan-500/30"
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

                <p className="text-xs text-gray-500 text-center">
                  {agents.filter(a => a.enabled).length} of {agents.length} agents enabled
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  return (
    <div className="min-h-screen bg-[#1a1a2e] dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#16213e]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2.5 rounded-xl">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Code Reviewer</h1>
              <p className="text-xs text-gray-400">Analysis Complete</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportToPDF}
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              onClick={() => setResult(null)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              New Analysis
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Security Issues</p>
                  <p className="text-3xl font-bold text-red-400">{result.metrics.security}</p>
                </div>
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500/10 border-yellow-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Bugs Detected</p>
                  <p className="text-3xl font-bold text-yellow-400">{result.metrics.bugs}</p>
                </div>
                <Bug className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Quality Issues</p>
                  <p className="text-3xl font-bold text-purple-400">{result.metrics.quality}</p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Improvements</p>
                  <p className="text-3xl font-bold text-blue-400">{result.metrics.improvements}</p>
                </div>
                <Lightbulb className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Split View */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Code Viewer with Highlights */}
          <Card className="bg-[#0f3460] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                Code Review
              </CardTitle>
              <CardDescription className="text-gray-400">
                Lines highlighted by severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="font-mono text-sm">
                  {result.code.split('\n').map((line, index) => {
                    const lineNumber = index + 1;
                    const highlight = result.highlights.find(h => h.line === lineNumber);
                    return (
                      <div
                        key={index}
                        className={`flex gap-4 px-3 py-1 border-l-4 ${
                          highlight
                            ? getSeverityColor(highlight.severity)
                            : "border-transparent"
                        }`}
                      >
                        <span className="text-gray-500 select-none w-8 text-right">
                          {lineNumber}
                        </span>
                        <span className="text-gray-300">{line || ' '}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: Issue Feed */}
          <Card className="bg-[#0f3460] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Issues Found
              </CardTitle>
              <CardDescription className="text-gray-400">
                Detailed analysis from AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="single" collapsible className="space-y-4">
                  {result.issues.map((issue) => (
                    <AccordionItem
                      key={issue.id}
                      value={issue.id}
                      className="bg-[#16213e] border border-gray-700 rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-start gap-3 text-left">
                          <div className="mt-1">
                            {getSeverityBadge(issue.severity)}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{issue.title}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {issue.agent} • Line {issue.line}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p className="text-sm text-gray-300">{issue.description}</p>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Before:</Label>
                          <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                            <pre className="text-xs text-red-300 font-mono overflow-x-auto">
                              {issue.oldCode}
                            </pre>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">After (Suggested):</Label>
                          <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                            <pre className="text-xs text-green-300 font-mono overflow-x-auto">
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

      {/* Floating Export Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={exportToPDF}
          size="lg"
          className="h-14 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-2xl shadow-cyan-500/40 rounded-full"
        >
          <Download className="w-5 h-5 mr-2" />
          Export to PDF
        </Button>
      </div>
    </div>
  );
}
