import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2, Phone, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgentsList() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    agentName: "",
    phoneNumber: "",
    description: "",
  });

  const { data: agents = [], isLoading, refetch } = trpc.vapi.agents.list.useQuery();

  const deleteMutation = trpc.vapi.agents.delete.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedAgent(null);
    },
  });

  const updateMutation = trpc.vapi.agents.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingAgent(null);
    },
  });

  const handleEdit = (agent: any) => {
    setEditingAgent(agent);
    setEditFormData({
      agentName: agent.agentName,
      phoneNumber: agent.phoneNumber || "",
      description: agent.description || "",
    });
  };

  const handleSaveEdit = () => {
    if (editingAgent) {
      updateMutation.mutate({
        id: editingAgent.id,
        agentName: editFormData.agentName,
        phoneNumber: editFormData.phoneNumber || undefined,
        description: editFormData.description || undefined,
      });
    }
  };

  const handleDelete = (agentId: number) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      deleteMutation.mutate({ id: agentId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No agents configured yet. Go to the Setup tab to create your first agent.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent: any) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Agent Header */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {agent.agentName}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {agent.agentId}</p>
                </div>

                {/* Agent Details */}
                <div className="space-y-2 text-sm">
                  {agent.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4" />
                      <span>{agent.phoneNumber}</span>
                    </div>
                  )}
                  {agent.description && (
                    <p className="text-gray-600">{agent.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        agent.isActive === "true"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agent.isActive === "true" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(agent)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(agent.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update agent details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-agentName">Agent Name</Label>
              <Input
                id="edit-agentName"
                value={editFormData.agentName}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    agentName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber">Phone Number</Label>
              <Input
                id="edit-phoneNumber"
                value={editFormData.phoneNumber}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setEditingAgent(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

