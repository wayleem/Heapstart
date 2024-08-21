// src/hooks/useTrackingForms.ts

import { useState } from "react";
import { useAppDispatch } from "@store/index";
import { updateOrderTracking } from "@store/thunks/orderThunks";
import { TrackingFormData } from "@types";

export const useTrackingForms = () => {
	const dispatch = useAppDispatch();
	const [trackingForms, setTrackingForms] = useState<{ [key: string]: TrackingFormData }>({});

	const handleTrackingFormChange = (
		orderId: string,
		productId: string,
		field: keyof TrackingFormData,
		value: string,
	) => {
		setTrackingForms((prev) => ({
			...prev,
			[`${orderId}-${productId}`]: {
				...prev[`${orderId}-${productId}`],
				[field]: value,
			},
		}));
	};

	const handleTrackingSubmit = (orderId: string, productId: string) => {
		const trackingInfo = trackingForms[`${orderId}-${productId}`];
		if (trackingInfo) {
			dispatch(updateOrderTracking({ orderId, productId, trackingInfo }));
			// Clear the form after submission
			setTrackingForms((prev) => {
				const newForms = { ...prev };
				delete newForms[`${orderId}-${productId}`];
				return newForms;
			});
		}
	};

	return {
		trackingForms,
		handleTrackingFormChange,
		handleTrackingSubmit,
	};
};
