import { Request, Response } from "express";
import Product from "../models/Product";
import { ProductErrors } from "../utils/errors";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ type: ProductErrors.PRODUCT_CREATION_ERROR, message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ type: ProductErrors.PRODUCT_NOT_FOUND, message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ type: ProductErrors.SERVER_ERROR, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ type: ProductErrors.SERVER_ERROR, message: error.message });
  }
};

export const uploadProductImages = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ type: ProductErrors.PRODUCT_NOT_FOUND, message: "Product not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ type: ProductErrors.INVALID_PRODUCT_DATA, message: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    const imageBuffers = files.map(file => file.buffer.toString('base64'));

    product.images = product.images.concat(imageBuffers);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ type: ProductErrors.PRODUCT_UPDATE_ERROR, message: error.message });
  }
};
