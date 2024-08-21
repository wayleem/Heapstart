// src/components/forms/TrackingForm.tsx

import { TrackingFormData } from "@types";
import React from "react";

interface TrackingFormProps {
	initialData: TrackingFormData;
	onSubmit: (data: TrackingFormData) => void;
	onChange: (field: keyof TrackingFormData, value: string) => void;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ initialData, onSubmit, onChange }) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(initialData);
	};

	return (
		<form onSubmit={handleSubmit} className="mt-2 space-y-2">
			<input
				type="text"
				placeholder="Carrier"
				className="w-full p-2 border rounded"
				value={initialData.carrier}
				onChange={(e) => onChange("carrier", e.target.value)}
			/>
			<input
				type="text"
				placeholder="Tracking Number"
				className="w-full p-2 border rounded"
				value={initialData.trackingNumber}
				onChange={(e) => onChange("trackingNumber", e.target.value)}
			/>
			<input
				type="text"
				placeholder="Tracking Link (optional)"
				className="w-full p-2 border rounded"
				value={initialData.trackingLink}
				onChange={(e) => onChange("trackingLink", e.target.value)}
			/>
			<button
				type="submit"
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
			>
				Update Tracking
			</button>
		</form>
	);
};

export default TrackingForm;
