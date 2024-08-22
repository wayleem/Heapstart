import React from "react";
import SupportTicketList from "@components/tables/SupportTicketList";

const SupportTicketManagement: React.FC = () => {
	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-6">Support Ticket Management</h1>
			<SupportTicketList />
		</div>
	);
};

export default SupportTicketManagement;
