import { useAppDispatch } from "@store/index";
import { createSupportTicket } from "@store/thunks/supportTicketThunks";
import React, { useState } from "react";

interface SupportTicketFormProps {
	orderId: string;
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ orderId }) => {
	const dispatch = useAppDispatch();
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(createSupportTicket({ orderId, subject, description }));
		setSubject("");
		setDescription("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="subject" className="block text-sm font-medium text-gray-700">
					Subject
				</label>
				<input
					type="text"
					id="subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label htmlFor="description" className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					rows={4}
				></textarea>
			</div>
			<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Submit Ticket
			</button>
		</form>
	);
};

export default SupportTicketForm;
