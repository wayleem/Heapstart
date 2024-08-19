import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import { ProductErrors } from "../utils/errors";
import { uploadImage } from "../utils/imageUpload";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ type: ProductErrors.SERVER_ERROR, message: "Failed to fetch products" });
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
    console.error('Error fetching product:', error);
    res.status(500).json({ type: ProductErrors.SERVER_ERROR, message: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: Partial<IProduct> = req.body;

    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await Promise.all(
        (req.files as Express.Multer.File[]).map(file => uploadImage(file))
      );
      productData.images = imageUrls;
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({ type: ProductErrors.PRODUCT_CREATION_ERROR, message: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productData: Partial<IProduct> = req.body;
    const newImages = req.files as Express.Multer.File[];
    const existingImages = JSON.parse(req.body.existingImages || '[]');

    let updatedImages = [...existingImages];

    if (newImages && newImages.length > 0) {
      const newImageUrls = await Promise.all(
        newImages.map(file => uploadImage(file))
      );
      updatedImages = [...updatedImages, ...newImageUrls];
    }

    productData.images = updatedImages;

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ type: ProductErrors.PRODUCT_NOT_FOUND, message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      type: ProductErrors.PRODUCT_UPDATE_ERROR,
      message: "Failed to update product",
      error: error.message
    });
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
    console.error('Product deactivation error:', error);
    res.status(400).json({ type: ProductErrors.PRODUCT_DELETION_ERROR, message: "Failed to deactivate product" });
  }
};
