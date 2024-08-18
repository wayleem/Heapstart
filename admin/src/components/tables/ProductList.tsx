import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "@store/index";
import { RootState } from "@types";
import { fetchProducts, removeProduct } from "@store/thunks/productThunks";

const ProductList: React.FC = () => {
	const dispatch = useAppDispatch();
	const products = useSelector((state: RootState) => state.product.items);
	const status = useSelector((state: RootState) => state.product.status);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchProducts());
		}
	}, [status, dispatch]);

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			dispatch(removeProduct(id));
		}
	};

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.category.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="sm:flex sm:items-center sm:justify-between">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">Products</h1>
					<p className="mt-2 text-sm text-gray-700">A list of all the products in your store.</p>
				</div>
				<div className="mt-4 sm:mt-0 sm:flex-none">
					<Link
						to="/add"
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
						Add Product
					</Link>
				</div>
			</div>

			<div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<div className="flex items-center mb-4">
						<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						<input
							type="text"
							placeholder="Search products..."
							className="ml-2 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{filteredProducts.length === 0 ? (
						<p className="text-center text-gray-500 py-4">No products found.</p>
					) : (
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Name
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Price
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Category
									</th>
									<th scope="col" className="relative px-6 py-3">
										<span className="sr-only">Actions</span>
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredProducts.map((product) => (
									<tr key={product._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{product.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											${product.price.toFixed(2)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{product.category}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<Link
												to={`/edit/${product._id}`}
												className="text-indigo-600 hover:text-indigo-900 mr-4"
											>
												<PencilIcon className="h-5 w-5 inline-block" aria-hidden="true" />
												<span className="ml-1">Edit</span>
											</Link>
											<button
												onClick={() => handleDelete(product._id)}
												className="text-red-600 hover:text-red-900"
											>
												<TrashIcon className="h-5 w-5 inline-block" aria-hidden="true" />
												<span className="ml-1">Delete</span>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductList;
