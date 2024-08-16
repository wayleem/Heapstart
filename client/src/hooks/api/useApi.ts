// src/hooks/useApi.ts
import { useState, useCallback } from "react";
import { apiClient } from "@api/apiClient";
import { AxiosError } from "axios";

export const useApi = <T>() => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const request = useCallback(async (method: "get" | "post" | "put" | "delete", url: string, payload?: any) => {
		setLoading(true);
		setError(null);
		try {
			const response = await apiClient[method]<T>(url, payload);
			setData(response);
			return response;
		} catch (err) {
			const error = err as AxiosError;
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { data, error, loading, request };
};
