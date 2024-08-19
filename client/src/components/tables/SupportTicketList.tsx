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
		<div>
			<h2 className="text-xl font-semibold mb-3">Support Tickets</h2>
			{tickets.length === 0 ? (
				<p>You have no open support tickets.</p>
			) : (
				<div className="bg-base-100 shadow-md rounded overflow-x-auto">
					<table className="w-full">
						<thead className="bg-base-200">
							<tr>
								<th className="p-2 text-left">Ticket ID</th>
								<th className="p-2 text-left">Subject</th>
								<th className="p-2 text-left">Status</th>
								<th className="p-2 text-left">Created At</th>
							</tr>
						</thead>
						<tbody>
							{tickets.map((ticket) => (
								<tr key={ticket._id} className="border-b border-base-200">
									<td className="p-2">{ticket._id}</td>
									<td className="p-2">{ticket.subject}</td>
									<td className="p-2">{ticket.status}</td>
									<td className="p-2">{new Date(ticket.createdAt).toLocaleDateString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default SupportTicketList;
