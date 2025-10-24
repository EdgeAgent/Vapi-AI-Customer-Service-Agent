import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Phone, Settings, BarChart3, Plus } from "lucide-react";
import AgentSetup from "./AgentSetup";
import CallInterface from "./CallInterface";
import AgentsList from "./AgentsList";
import CallLogs from "./CallLogs";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-12 w-12" />}
            </div>
            <CardTitle className="text-3xl">{APP_TITLE}</CardTitle>
            <CardDescription>
              Manage and deploy Vapi AI customer service agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              Sign in to create, configure, and manage your Vapi AI customer service agents with custom API credentials.
            </p>
            <a href={getLoginUrl()}>
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name || user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="call" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Your Vapi AI Agents</CardTitle>
                <CardDescription>
                  Manage all your configured Vapi AI customer service agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentsList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Add New Agent</CardTitle>
                <CardDescription>
                  Configure a new Vapi AI customer service agent with your API credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentSetup />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Call Tab */}
          <TabsContent value="call">
            <Card>
              <CardHeader>
                <CardTitle>Call Interface</CardTitle>
                <CardDescription>
                  Initiate calls with your Vapi AI agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CallInterface />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Call Logs</CardTitle>
                <CardDescription>
                  View history of calls made through your agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CallLogs />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

