import { createAsyncThunk } from "@reduxjs/toolkit";
import { supportTicketApi } from "../../api/endpoints";
import { SupportTicket } from "../../types/supportTicket";
import { setTickets, addTicket, setStatus, setError } from "../slices/supportTicketSlice";
import { CreateSupportTicketRequest } from "@types";

export const fetchUserSupportTickets = createAsyncThunk("supportTickets/fetchUserTickets", async (_, { dispatch }) => {
	try {
		dispatch(setStatus("loading"));
		const tickets = await supportTicketApi.getUserSupportTickets();
		dispatch(setTickets(tickets));
		dispatch(setStatus("succeeded"));
	} catch (error) {
		dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
		dispatch(setStatus("failed"));
	}
});

export const createSupportTicket = createAsyncThunk<SupportTicket, CreateSupportTicketRequest>(
	"supportTickets/createTicket",
	async (ticketData, { dispatch }) => {
		try {
			dispatch(setStatus("loading"));
			const newTicket = await supportTicketApi.createSupportTicket(ticketData);
			dispatch(addTicket(newTicket));
			dispatch(setStatus("succeeded"));
			return newTicket;
		} catch (error) {
			dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
			dispatch(setStatus("failed"));
			throw error;
		}
	},
);

export const deleteSupportTicket = createAsyncThunk("supportTickets/delete", async (id: string, { dispatch }) => {
	try {
		dispatch(setStatus("loading"));
		await supportTicketApi.deleteSupportTicket(id);
		dispatch(removeTicket(id));
		dispatch(setStatus("succeeded"));
	} catch (error) {
		dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
		dispatch(setStatus("failed"));
		throw error;
	}
});
