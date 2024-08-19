// src/components/modals/SupportTicketModal.tsx

import React, { useState } from "react";
import { useAppDispatch } from "@store/index";
import { createSupportTicket } from "@store/thunks/supportTicketThunks";

interface SupportTicketModalProps {
	orderId: string;
	onClose: () => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ orderId, onClose }) => {
	const dispatch = useAppDispatch();
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(createSupportTicket({ orderId, subject, description })).unwrap();
			onClose();
			// Optionally, show a success message
		} catch (error) {
			console.error("Failed to create support ticket:", error);
			// Optionally, show an error message
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg max-w-md w-full">
				<h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="subject" className="block text-sm font-medium text-gray-700">
							Subject
						</label>
						<input
							type="text"
							id="subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="description" className="block text-sm font-medium text-gray-700">
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
							rows={4}
							required
						></textarea>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
						>
							Submit Ticket
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SupportTicketModal;
