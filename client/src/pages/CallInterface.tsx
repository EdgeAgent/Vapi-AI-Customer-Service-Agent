import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Phone, PhoneOff, Loader2, AlertCircle, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CallInterface() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: agents = [] } = trpc.vapi.agents.list.useQuery();

  const createCallLogMutation = trpc.vapi.callLogs.create.useMutation({
    onSuccess: () => {
      setIsCallActive(false);
      setCallDuration(0);
      setPhoneNumber("");
      if (timerRef.current) clearInterval(timerRef.current);
    },
    onError: (err) => {
      setError(err.message || "Failed to log call");
    },
  });

  const handleStartCall = async () => {
    setError(null);

    if (!selectedAgentId) {
      setError("Please select an agent");
      return;
    }

    if (!phoneNumber || !/^\+?[\d\s\-()]+$/.test(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    const selectedAgent = agents.find(
      (a: any) => a.id === parseInt(selectedAgentId)
    );

    if (!selectedAgent) {
      setError("Selected agent not found");
      return;
    }

    // In a real implementation, this would call the Vapi API to initiate a call
    // For now, we'll simulate the call and log it
    setIsCallActive(true);
    setCallDuration(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Simulate call logging after 5 seconds
    setTimeout(() => {
      if (isCallActive) {
        createCallLogMutation.mutate({
          agentId: parseInt(selectedAgentId),
          callId: `call_${Date.now()}`,
          callerNumber: phoneNumber,
          duration: callDuration,
          status: "completed",
          transcript: "Call transcript would be stored here",
        });
      }
    }, 5000);
  };

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    createCallLogMutation.mutate({
      agentId: parseInt(selectedAgentId),
      callId: `call_${Date.now()}`,
      callerNumber: phoneNumber,
      duration: callDuration,
      status: "completed",
      transcript: "Call transcript would be stored here",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                How to use the Call Interface:
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Select an agent from the dropdown</li>
                <li>Enter the phone number to call</li>
                <li>Click "Start Call" to initiate the call</li>
                <li>The call will be logged automatically</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Call Interface */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Agent Selection */}
            <div className="space-y-2">
              <Label htmlFor="agent-select">Select Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger id="agent-select">
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent: any) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.agentName} ({agent.agentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number to Call</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isCallActive}
              />
              <p className="text-xs text-gray-500">
                Enter the phone number you want to call
              </p>
            </div>

            {/* Call Status */}
            {isCallActive && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      Call in Progress
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Calling: {phoneNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-green-900">
                      {formatDuration(callDuration)}
                    </p>
                    <p className="text-xs text-green-700">Duration</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isCallActive ? (
                <Button
                  onClick={handleStartCall}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedAgentId || !phoneNumber}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
              ) : (
                <Button
                  onClick={handleEndCall}
                  variant="destructive"
                  className="flex-1"
                  disabled={createCallLogMutation.isPending}
                >
                  {createCallLogMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Call
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Integration Notes:
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              This interface provides a template for integrating Vapi AI calls. In production, you would:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use Vapi's JavaScript SDK to initiate actual calls</li>
              <li>Implement WebRTC for real-time audio streaming</li>
              <li>Store call transcripts and recordings securely</li>
              <li>Handle call events and status updates</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

