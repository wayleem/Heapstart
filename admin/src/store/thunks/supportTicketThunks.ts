import { createAsyncThunk } from "@reduxjs/toolkit";
import { supportTicketApi } from "@api/endpoints";
import { setTickets, updateTicket, setStatus, setError } from "../slices/supportTicketSlice";

export const fetchAllSupportTickets = createAsyncThunk("supportTickets/fetchAll", async (_, { dispatch }) => {
	try {
		dispatch(setStatus("loading"));
		const tickets = await supportTicketApi.getAllSupportTickets();
		dispatch(setTickets(tickets));
		dispatch(setStatus("succeeded"));
	} catch (error) {
		console.error("Error fetching support tickets:", error);
		dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
		dispatch(setStatus("failed"));
	}
});

export const updateSupportTicket = createAsyncThunk(
	"supportTickets/update",
	async ({ id, status, adminResponse }: { id: string; status: string; adminResponse: string }, { dispatch }) => {
		try {
			dispatch(setStatus("loading"));
			const updatedTicket = await supportTicketApi.updateSupportTicket(id, { status, adminResponse });
			dispatch(updateTicket(updatedTicket));
			dispatch(setStatus("succeeded"));
		} catch (error) {
			dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
			dispatch(setStatus("failed"));
		}
	},
);
