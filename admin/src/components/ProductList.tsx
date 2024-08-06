import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, removeProduct } from "../store/slices/productsSlice";
import { RootState, AppDispatch } from "../store";

const ProductList: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const products = useSelector((state: RootState) => state.products.products);
	const status = useSelector((state: RootState) => state.products.status);

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

	if (status === "loading") {
		return <div className="text-center">Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-xl font-semibold text-gray-900">Products</h1>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<Link
						to="/add"
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Add Product
					</Link>
				</div>
			</div>
			<div className="mt-8 flex flex-col">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
									<tr>
										<th
											scope="col"
											className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
										>
											Name
										</th>
										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Price
										</th>
										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Category
										</th>
										<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
											<span className="sr-only">Actions</span>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{products.map((product) => (
										<tr key={product._id}>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
												{product.name}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												${product.price.toFixed(2)}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{product.category}
											</td>
											<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
												<Link
													to={`/edit/${product._id}`}
													className="text-indigo-600 hover:text-indigo-900 mr-4"
												>
													Edit
												</Link>
												<button
													onClick={() => handleDelete(product._id)}
													className="text-red-600 hover:text-red-900"
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductList;
