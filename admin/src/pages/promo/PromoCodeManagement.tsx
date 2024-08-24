import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchPromoCodes, createPromoCode, deletePromoCode } from "@store/thunks/promoCodeThunks";
import { PromoCode, RootState } from "@types";

const PromoCodeManagement: React.FC = () => {
	const dispatch = useAppDispatch();
	const promoCodes = useAppSelector((state: RootState) => state.promoCode.items);
	const [formData, setFormData] = useState<Partial<PromoCode>>({
		code: "",
		discountType: "percentage",
		discountValue: 0,
		validFrom: new Date(),
		validUntil: new Date(),
		usageLimit: 0,
	});

	useEffect(() => {
		dispatch(fetchPromoCodes());
	}, [dispatch]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		if (name === "discountType") {
			setFormData({ ...formData, [name]: value as "percentage" | "fixed" });
		} else if (name === "validFrom" || name === "validUntil") {
			setFormData({ ...formData, [name]: new Date(value) });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(createPromoCode(formData));
		setFormData({
			code: "",
			discountType: "percentage",
			discountValue: 0,
			validFrom: new Date(),
			validUntil: new Date(),
			usageLimit: 0,
		});
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this promo code?")) {
			dispatch(deletePromoCode(id));
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Promo Code Management</h1>
			<form onSubmit={handleSubmit} className="mb-8">
				<div className="grid grid-cols-2 gap-4">
					<input
						type="text"
						name="code"
						value={formData.code}
						onChange={handleInputChange}
						placeholder="Promo Code"
						className="border p-2"
						required
					/>
					<select
						name="discountType"
						value={formData.discountType}
						onChange={handleInputChange}
						className="border p-2"
						required
					>
						<option value="percentage">Percentage</option>
						<option value="fixed">Fixed Amount</option>
					</select>
					<input
						type="number"
						name="discountValue"
						value={formData.discountValue}
						onChange={handleInputChange}
						placeholder="Discount Value"
						className="border p-2"
						required
					/>
					<input
						type="date"
						name="validFrom"
						value={formData.validFrom?.toISOString().split("T")[0]}
						onChange={handleInputChange}
						className="border p-2"
						required
					/>
					<input
						type="date"
						name="validUntil"
						value={formData.validUntil?.toISOString().split("T")[0]}
						onChange={handleInputChange}
						className="border p-2"
						required
					/>
					<input
						type="number"
						name="usageLimit"
						value={formData.usageLimit}
						onChange={handleInputChange}
						placeholder="Usage Limit"
						className="border p-2"
						required
					/>
				</div>
				<button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
					Add Promo Code
				</button>
			</form>
			<table className="w-full">
				<thead>
					<tr>
						<th>Code</th>
						<th>Discount</th>
						<th>Valid From</th>
						<th>Valid Until</th>
						<th>Usage</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{promoCodes.map((promo) => (
						<tr key={promo._id}>
							<td>{promo.code}</td>
							<td>
								{promo.discountType === "percentage"
									? `${promo.discountValue}%`
									: `$${promo.discountValue}`}
							</td>
							<td>{new Date(promo.validFrom).toLocaleDateString()}</td>
							<td>{new Date(promo.validUntil).toLocaleDateString()}</td>
							<td>
								{promo.usageCount} / {promo.usageLimit}
							</td>
							<td>
								<button onClick={() => handleDelete(promo._id)} className="text-red-500">
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PromoCodeManagement;
