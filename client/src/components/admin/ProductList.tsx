import React from "react";

interface ProductListProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onDeactivate: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDeactivate }) => {
	return (
		<div className="mt-8">
			<h3 className="text-xl font-bold mb-4">Product List</h3>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Price
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Supplier ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Supplier Cost
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{products.map((product) => (
						<tr key={product._id}>
							<td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
							<td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
							<td className="px-6 py-4 whitespace-nowrap">{product.supplier_id}</td>
							<td className="px-6 py-4 whitespace-nowrap">${product.supplier_cost.toFixed(2)}</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<span
									className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
										product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
									}`}
								>
									{product.isActive ? "Active" : "Inactive"}
								</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<button
									onClick={() => onEdit(product)}
									className="text-indigo-600 hover:text-indigo-900 mr-4"
								>
									Edit
								</button>
								<button
									onClick={() => onDeactivate(product._id)}
									className="text-red-600 hover:text-red-900"
								>
									{product.isActive ? "Deactivate" : "Activate"}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ProductList;
