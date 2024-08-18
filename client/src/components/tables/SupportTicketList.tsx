import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@types";
import { fetchUserSupportTickets } from "@store/thunks/supportTicketThunks";
import { useAppDispatch } from "@store/index";

const SupportTicketList: React.FC = () => {
	const dispatch = useAppDispatch();
	const { tickets, status } = useSelector((state: RootState) => state.supportTickets);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchUserSupportTickets());
		}
	}, [status, dispatch]);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold">Your Support Tickets</h2>
			{tickets.map((ticket) => (
				<div key={ticket._id} className="border p-4 rounded-md">
					<h3 className="font-semibold">{ticket.subject}</h3>
					<p className="text-gray-600">{ticket.description}</p>
					<p className="text-sm text-gray-500">Status: {ticket.status}</p>
				</div>
			))}
		</div>
	);
};

export default SupportTicketList;
