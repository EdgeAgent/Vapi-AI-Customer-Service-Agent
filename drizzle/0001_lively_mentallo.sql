CREATE TABLE `vapi_agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentName` varchar(255) NOT NULL,
	`agentId` varchar(255) NOT NULL,
	`apiKey` text NOT NULL,
	`publicKey` text,
	`assistantId` varchar(255),
	`phoneNumber` varchar(20),
	`description` text,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vapi_agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vapi_call_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`callId` varchar(255) NOT NULL,
	`callerNumber` varchar(20),
	`duration` int,
	`status` varchar(50),
	`transcript` text,
	`recordingUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vapi_call_logs_id` PRIMARY KEY(`id`)
);
