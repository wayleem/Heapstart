// File: src/components/tables/SupportTicketList.tsx

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchAllSupportTickets, updateSupportTicket } from "@store/thunks/supportTicketThunks";
import { RootState, SupportTicket } from "@types";

const SupportTicketList: React.FC = () => {
	const dispatch = useAppDispatch();
	const tickets = useAppSelector((state: RootState) => state.supportTicket.tickets);
	const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

	useEffect(() => {
		dispatch(fetchAllSupportTickets());
	}, [dispatch]);

	const handleUpdateStatus = async (id: string, status: string) => {
		await dispatch(updateSupportTicket({ id, status }));
		setSelectedTicket(null);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">ID</th>
						<th className="py-2 px-4 border-b">Subject</th>
						<th className="py-2 px-4 border-b">Status</th>
						<th className="py-2 px-4 border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{tickets.map((ticket) => (
						<tr key={ticket._id}>
							<td className="py-2 px-4 border-b">{ticket._id}</td>
							<td className="py-2 px-4 border-b">{ticket.subject}</td>
							<td className="py-2 px-4 border-b">{ticket.status}</td>
							<td className="py-2 px-4 border-b">
								<button
									onClick={() => setSelectedTicket(ticket)}
									className="bg-blue-500 text-white px-2 py-1 rounded"
								>
									Update Status
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{selectedTicket && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-4 rounded-lg w-1/2">
						<h2 className="text-xl font-bold mb-2">{selectedTicket.subject}</h2>
						<p className="mb-4">{selectedTicket.description}</p>
						<div className="flex justify-end">
							<button
								onClick={() => handleUpdateStatus(selectedTicket._id, "open")}
								className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
							>
								Open
							</button>
							<button
								onClick={() => handleUpdateStatus(selectedTicket._id, "in-progress")}
								className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
							>
								In Progress
							</button>
							<button
								onClick={() => handleUpdateStatus(selectedTicket._id, "resolved")}
								className="bg-green-500 text-white px-4 py-2 rounded mr-2"
							>
								Resolved
							</button>
							<button
								onClick={() => handleUpdateStatus(selectedTicket._id, "closed")}
								className="bg-red-500 text-white px-4 py-2 rounded mr-2"
							>
								Closed
							</button>
							<button
								onClick={() => setSelectedTicket(null)}
								className="bg-gray-500 text-white px-4 py-2 rounded"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SupportTicketList;
