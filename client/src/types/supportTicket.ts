export interface SupportTicket {
	_id: string;
	userId: string;
	orderId: string;
	subject: string;
	description: string;
	status: "open" | "in-progress" | "resolved" | "closed";
	createdAt: string;
	updatedAt: string;
}

export interface CreateSupportTicketData {
	orderId: string;
	subject: string;
	description: string;
}

export interface SupportTicketState {
	tickets: SupportTicket[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}
