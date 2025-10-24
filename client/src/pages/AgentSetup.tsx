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
    agentName: "",
    agentId: "",
    apiKey: "",
    publicKey: "",
    assistantId: "",
    phoneNumber: "",
    description: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = trpc.vapi.agents.create.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setFormData({
        agentName: "",
        agentId: "",
        apiKey: "",
        publicKey: "",
        assistantId: "",
        phoneNumber: "",
        description: "",
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
      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Where to find your Vapi AI credentials:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Agent ID:</strong> Found in your Vapi dashboard under Agent Settings
            </li>
            <li>
              <strong>API Key:</strong> Generate from Vapi API Keys section in your account
            </li>
            <li>
              <strong>Public Key:</strong> Optional, used for client-side authentication
            </li>
            <li>
              <strong>Assistant ID:</strong> Optional, specific assistant configuration ID
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
              From your Vapi dashboard
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
              Keep this secure - never share publicly
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

      {/* Additional Info */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Implementation Options:
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900">1. Number Porting (Recommended)</p>
              <p>Port your existing phone number to Twilio for seamless AI agent integration.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">2. Call Forwarding</p>
              <p>Set up call forwarding from your current number to a new Twilio number.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">3. Outbound Only</p>
              <p>Use the agent for making outbound calls and SMS with your verified number.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

