import React from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useProductForm } from "@hooks/useProductForm";
import Loading from "@components/common/Loading";

const ProductForm: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { formData, setFormData, imagePreviews, setImagePreviews, status, error, handleChange, handleSubmit } =
		useProductForm(id);

	const onDragEnd = (result: any) => {
		if (!result.destination) {
			return;
		}

		const items = Array.from(imagePreviews);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setImagePreviews(items);
		setFormData({ ...formData, images: items });
	};

	const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setFormData({ ...formData, images: [...(formData.images || []), ...filesArray] });

			const newPreviews = filesArray.map((file: File) => URL.createObjectURL(file));
			setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
		}
	};

	const removeNewImage = (index: number) => {
		setFormData({
			...formData,
			images: (formData.images || []).filter((_, i) => i !== index),
		});
		setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
	};

	if (status === "loading") {
		return <Loading />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
			<h2 className="text-2xl font-semibold mb-4">{id ? "Edit Product" : "Add Product"}</h2>

			<div>
				<label htmlFor="name" className="block text-sm font-medium text-gray-700">
					Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>

			<div>
				<label htmlFor="description" className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				/>
			</div>

			<div>
				<label htmlFor="price" className="block text-sm font-medium text-gray-700">
					Price
				</label>
				<input
					type="number"
					id="price"
					name="price"
					value={formData.price}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>

			<div>
				<label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">
					Supplier ID
				</label>
				<input
					type="text"
					id="supplier_id"
					name="supplier_id"
					value={formData.supplier_id}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>

			<div>
				<label htmlFor="supplier_cost" className="block text-sm font-medium text-gray-700">
					Supplier Cost
				</label>
				<input
					type="number"
					id="supplier_cost"
					name="supplier_cost"
					value={formData.supplier_cost}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>

			<div>
				<label htmlFor="supplier_link" className="block text-sm font-medium text-gray-700">
					Supplier Link
				</label>
				<input
					type="url"
					id="supplier_link"
					name="supplier_link"
					value={formData.supplier_link}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>

			<div>
				<label htmlFor="category" className="block text-sm font-medium text-gray-700">
					Category
				</label>
				<input
					type="text"
					id="category"
					name="category"
					value={formData.category}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				/>
			</div>

			<div>
				<label htmlFor="images" className="block text-sm font-medium text-gray-700">
					Images
				</label>
				<input
					type="file"
					id="images"
					name="images"
					onChange={handleNewImageChange}
					multiple
					className="mt-1 block w-full"
				/>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="images">
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2 mt-2">
							{imagePreviews.map((preview, index) => (
								<Draggable key={preview} draggableId={preview} index={index}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className="relative"
										>
											<img
												src={preview}
												alt={`Preview ${index}`}
												className="w-24 h-24 object-cover rounded"
											/>
											<button
												type="button"
												onClick={() => removeNewImage(index)}
												className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
											>
												&times;
											</button>
											{index === 0 && (
												<span className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded">
													Main
												</span>
											)}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				{id ? "Update Product" : "Add Product"}
			</button>
		</form>
	);
};

export default ProductForm;
