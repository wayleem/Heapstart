import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupportTicket, SupportTicketState } from "@types";

const initialState: SupportTicketState = {
	tickets: [],
	status: "idle",
	error: null,
};

const supportTicketSlice = createSlice({
	name: "supportTickets",
	initialState,
	reducers: {
		setTickets: (state, action: PayloadAction<SupportTicket[]>) => {
			state.tickets = action.payload;
		},
		addTicket: (state, action: PayloadAction<SupportTicket>) => {
			state.tickets.push(action.payload);
		},
		setStatus: (state, action: PayloadAction<SupportTicketState["status"]>) => {
			state.status = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		removeTicket: (state, action: PayloadAction<string>) => {
			state.tickets = state.tickets.filter((ticket) => ticket._id !== action.payload);
		},
	},
});

export const { setTickets, addTicket, setStatus, setError, removeTicket } = supportTicketSlice.actions;

export default supportTicketSlice.reducer;
