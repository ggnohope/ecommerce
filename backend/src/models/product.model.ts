import mongoose, { model, Schema } from "mongoose";

const PRODUCT_DOCUMENT_NAME = "product";
const PRODUCT_COLLECTION_NAME = "products";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["electronics", "clothing", "furniture"], // Ví dụ một số loại sản phẩm
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME,
  }
);

const CLOTHING_DOCUMENT_NAME = "clothing";
const CLOTHING_COLLECTION_NAME = "clothings";

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: ["S", "M", "L", "XL"],
    },
    material: {
      type: String,
      required: [true, "Material is required"],
    },
  },
  {
    timestamps: true,
    collection: CLOTHING_COLLECTION_NAME,
  }
);

const ELECTRONIC_DOCUMENT_NAME = "electronics";
const ELECTRONIC_COLLECTION_NAME = "electronics";

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
  },
  {
    timestamps: true,
    collection: ELECTRONIC_COLLECTION_NAME,
  }
);

const FURNITURE_DOCUMENT_NAME = "furniture";
const FURNITURE_COLLECTION_NAME = "furnitures";

const furnitureSchema = new mongoose.Schema(
  {
    weight: {
      type: Number, // Khối lượng của sản phẩm
      required: [true, "Weight is required"],
    },
    style: {
      type: String,
      required: [true, "Style is required"],
    },
    dimensions: {
      length: { type: Number, required: true }, // Chiều dài
      width: { type: Number, required: true }, // Chiều rộng
      height: { type: Number, required: true }, // Chiều cao
    },
  },
  {
    timestamps: true,
    collection: FURNITURE_COLLECTION_NAME,
  }
);

// Tạo các models
const ProductModel = model(PRODUCT_DOCUMENT_NAME, productSchema);
const ClothingModel = model(CLOTHING_DOCUMENT_NAME, clothingSchema);
const ElectronicModel = model(ELECTRONIC_DOCUMENT_NAME, electronicSchema);
const FurnitureModel = model(FURNITURE_DOCUMENT_NAME, furnitureSchema);

// Export các models
export { ProductModel, ClothingModel, ElectronicModel, FurnitureModel };
