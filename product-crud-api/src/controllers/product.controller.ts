import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

const productRepo = () => AppDataSource.getRepository(Product);

const validate = (body: any) => {
  if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 255) {
    return "Name is required (max 255 characters)";
  }
  if (
    body.price === undefined ||
    body.price === null ||
    body.price === "" ||
    !Number.isFinite(Number(body.price)) ||
    Number(body.price) < 0
  ) {
    return "Price must be a valid non-negative number";
  }
  return null;
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productRepo().find({ order: { createdAt: "DESC" } });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid id" });

  try {
    const product = await productRepo().findOneBy({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const { name, price, description } = req.body;
    const product = productRepo().create({
      name: name.trim(),
      price: Number(price),
      description: typeof description === "string" && description.trim() ? description.trim() : null,
    });
    await productRepo().save(product);
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid id" });

  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const product = await productRepo().findOneBy({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name.trim();
    product.price = Number(req.body.price);
    product.description =
      typeof req.body.description === "string" && req.body.description.trim()
        ? req.body.description.trim()
        : null;

    await productRepo().save(product);
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid id" });

  try {
    const product = await productRepo().findOneBy({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    await productRepo().remove(product);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
