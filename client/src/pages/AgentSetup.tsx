import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function AgentSetup() {
  const [formData, setFormData] = useState({
    agentName: "Demo Customer Support Agent",
    agentId: "agent_demo_001",
    apiKey: "demo_key_12345",
    publicKey: "",
    assistantId: "asst_demo_001",
    phoneNumber: "+1 (555) 123-4567",
    description: "A demo customer service agent for testing",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = trpc.vapi.agents.create.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setFormData({
        agentName: "Demo Customer Support Agent",
        agentId: "agent_demo_001",
        apiKey: "demo_key_12345",
        publicKey: "",
        assistantId: "asst_demo_001",
        phoneNumber: "+1 (555) 123-4567",
        description: "A demo customer service agent for testing",
      });
      setError(null);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.message || "Failed to create agent");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agentName || !formData.agentId || !formData.apiKey) {
      setError("Agent Name, Agent ID, and API Key are required");
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Demo Mode Info */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Demo Mode Active
              </h3>
              <p className="text-sm text-amber-800">
                This application is running in demo mode with pre-filled sample credentials. You can modify the fields below and create test agents to explore all features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Getting Started:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Demo Mode:</strong> Pre-filled with sample data - modify as needed
            </li>
            <li>
              <strong>Create Agent:</strong> Click "Create Agent" to add a new agent
            </li>
            <li>
              <strong>View Agents:</strong> Go to the "Agents" tab to see all created agents
            </li>
            <li>
              <strong>Make Calls:</strong> Use the "Call" tab to initiate demo calls
            </li>
            <li>
              <strong>View Logs:</strong> Check the "Logs" tab to see call history
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Agent created successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent Name */}
          <div className="space-y-2">
            <Label htmlFor="agentName">
              Agent Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agentName"
              name="agentName"
              placeholder="e.g., Customer Support Bot"
              value={formData.agentName}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500">
              A friendly name for your agent
            </p>
          </div>

          {/* Agent ID */}
          <div className="space-y-2">
            <Label htmlFor="agentId">
              Agent ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agentId"
              name="agentId"
              placeholder="e.g., agent_abc123xyz"
              value={formData.agentId}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500">
              Unique identifier for this agent
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="apiKey">
              API Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              placeholder="sk-..."
              value={formData.apiKey}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500">
              Demo mode - use any value
            </p>
          </div>

          {/* Public Key */}
          <div className="space-y-2">
            <Label htmlFor="publicKey">Public Key (Optional)</Label>
            <Input
              id="publicKey"
              name="publicKey"
              placeholder="pk-..."
              value={formData.publicKey}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">
              For client-side authentication
            </p>
          </div>

          {/* Assistant ID */}
          <div className="space-y-2">
            <Label htmlFor="assistantId">Assistant ID (Optional)</Label>
            <Input
              id="assistantId"
              name="assistantId"
              placeholder="e.g., asst_..."
              value={formData.assistantId}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">
              Specific assistant configuration
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+1 (555) 000-0000"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">
              Twilio number for this agent
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what this agent does..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Agent...
            </>
          ) : (
            "Create Agent"
          )}
        </Button>
      </form>

      {/* Features Info */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Demo Features:
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900">✅ Agent Management</p>
              <p>Create, view, edit, and delete agents with full CRUD operations</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">✅ Call Simulation</p>
              <p>Initiate demo calls and track call status in real-time</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">✅ Call Logging</p>
              <p>View call history, export to CSV, and analyze call statistics</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">✅ User Authentication</p>
              <p>Secure login with Manus OAuth - each user has their own agents</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-600">
                <strong>To use with real Vapi credentials:</strong> Replace the demo values with your actual Vapi API key and agent ID from your Vapi dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

