import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import { createCrudController } from "./crudController";
import { createErrorResponse, ProductErrors } from "../utils/errors";
import logger from "../utils/logger";
import { uploadImage } from "../utils/imageUpload";

const productCrud = createCrudController(Product);

export const productController = {
	...productCrud,

	add: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const productData = req.body;
			if (req.files && Array.isArray(req.files)) {
				const imageUrls = await Promise.all(req.files.map((file) => uploadImage(file)));
				productData.images = imageUrls;
			}
			const newProduct = new Product(productData);
			await newProduct.save();
			logger.info("Product created successfully", { productId: newProduct._id });
			res.status(201).json(newProduct);
		} catch (error) {
			logger.error("Error creating product", { error });
			next(createErrorResponse(ProductErrors.PRODUCT_CREATION_ERROR, "Error creating product", 400, error));
		}
	},

	update: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const updateData = req.body;
			if (req.files && Array.isArray(req.files)) {
				const newImageUrls = await Promise.all(req.files.map((file) => uploadImage(file)));
				updateData.images = [...(updateData.images || []), ...newImageUrls];
			}
			const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
			if (!product) {
				logger.warn("Product not found for update", { productId: id });
				return next(createErrorResponse(ProductErrors.PRODUCT_NOT_FOUND, "Product not found", 404));
			}
			logger.info("Product updated successfully", { productId: id });
			res.json(product);
		} catch (error) {
			logger.error("Error updating product", { error, productId: req.params.id });
			next(createErrorResponse(ProductErrors.PRODUCT_UPDATE_ERROR, "Error updating product", 400, error));
		}
	},

	deactivate: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
			if (!product) {
				logger.warn("Product not found for deactivation", { productId: id });
				return next(createErrorResponse(ProductErrors.PRODUCT_NOT_FOUND, "Product not found", 404));
			}
			logger.info("Product deactivated successfully", { productId: id });
			res.json(product);
		} catch (error) {
			logger.error("Error deactivating product", { error, productId: req.params.id });
			next(createErrorResponse(ProductErrors.PRODUCT_UPDATE_ERROR, "Error deactivating product", 400, error));
		}
	},
};
