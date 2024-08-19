import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import { ProductErrors } from "../utils/errors";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.find({ isActive: true });
		res.json(products);
	} catch (error) {
		res.status(500).json({ type: ProductErrors.SERVER_ERROR, message: error.message });
	}
};

export const getProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product || !product.isActive) {
			return res.status(404).json({ type: ProductErrors.PRODUCT_NOT_FOUND, message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		res.status(500).json({ type: ProductErrors.SERVER_ERROR, message: error.message });
	}
};

export const createProduct = [
	upload.array("images", 5),
	async (req: Request, res: Response) => {
		try {
			const productData: Partial<IProduct> = req.body;

			if (productData.price) productData.price = Number(productData.price);
			if (productData.supplier_cost) productData.supplier_cost = Number(productData.supplier_cost);

			// Handle images
			productData.images = [];
			if (req.files && Array.isArray(req.files)) {
				const newImages = (req.files as Express.Multer.File[]).map((file) => file.buffer.toString("base64"));
				productData.images = [...productData.images, ...newImages];
			}

			const product = new Product(productData);
			await product.save();
			res.status(201).json(product);
		} catch (error) {
			console.error("Product creation error:", error);
			res.status(400).json({ type: ProductErrors.PRODUCT_CREATION_ERROR, message: error.message });
		}
	},
];

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const productData: Partial<IProduct> = req.body;

		// Handle existing images
		if (req.body.existingImages) {
			productData.images = Array.isArray(req.body.existingImages)
				? req.body.existingImages
				: [req.body.existingImages];
		} else {
			productData.images = [];
		}

		// Handle new images
		if (req.files && Array.isArray(req.files)) {
			const newImages = (req.files as Express.Multer.File[]).map((file) => file.buffer.toString("base64"));
			productData.images = [...productData.images, ...newImages];
		}

		const product = await Product.findByIdAndUpdate(req.params.id, productData, {
			new: true,
			runValidators: true,
		});

		if (!product) {
			return res.status(404).json({ type: ProductErrors.PRODUCT_NOT_FOUND, message: "Product not found" });
		}

		res.json(product);
	} catch (error) {
		res.status(400).json({ type: ProductErrors.PRODUCT_UPDATE_ERROR, message: error.message });
	}
};

export const deactivateProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
		if (!product) {
			return res.status(404).json({ type: ProductErrors.PRODUCT_NOT_FOUND, message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		res.status(400).json({ type: ProductErrors.PRODUCT_DELETION_ERROR, message: error.message });
	}
};
