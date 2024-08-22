export interface SupportTicket {
	_id: string;
	userId: string;
	subject: string;
	description: string;
	status: "open" | "in-progress" | "resolved" | "closed";
	adminResponse?: string;
	createdAt: string;
	updatedAt: string;
}

export interface SupportTicketState {
	tickets: SupportTicket[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}
