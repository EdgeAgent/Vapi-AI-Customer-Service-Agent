import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CallLogs() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const { data: agents = [] } = trpc.vapi.agents.list.useQuery();

  const { data: callLogs = [], isLoading } = trpc.vapi.callLogs.list.useQuery(
    { agentId: parseInt(selectedAgentId) },
    { enabled: !!selectedAgentId }
  );

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "missed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportCSV = () => {
    if (callLogs.length === 0) return;

    const headers = [
      "Call ID",
      "Caller Number",
      "Duration",
      "Status",
      "Date",
    ];
    const rows = callLogs.map((log: any) => [
      log.callId,
      log.callerNumber || "-",
      formatDuration(log.duration),
      log.status || "-",
      formatDate(log.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `call-logs-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Agent</label>
        <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an agent to view logs..." />
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

      {/* No Agent Selected */}
      {!selectedAgentId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Select an agent from the dropdown to view its call logs.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {selectedAgentId && isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Call Logs Table */}
      {selectedAgentId && !isLoading && (
        <>
          {callLogs.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No call logs found for this agent.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {/* Export Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>

              {/* Table */}
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Call ID</TableHead>
                          <TableHead>Caller Number</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date & Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {callLogs.map((log: any) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-sm">
                              {log.callId.substring(0, 12)}...
                            </TableCell>
                            <TableCell>
                              {log.callerNumber || "-"}
                            </TableCell>
                            <TableCell>
                              {formatDuration(log.duration)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                  log.status
                                )}`}
                              >
                                {log.status || "unknown"}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(log.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {callLogs.length}
                      </p>
                      <p className="text-sm text-gray-600">Total Calls</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDuration(
                          callLogs.reduce(
                            (sum: number, log: any) => sum + (log.duration || 0),
                            0
                          )
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Total Duration</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {callLogs.filter((log: any) => log.status === "completed")
                          .length}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

