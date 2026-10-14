"use client";

import { useState, useEffect, FormEvent } from "react";
import { Product, ProductInput } from "@/types";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (input: ProductInput) => Promise<void>;
};

export default function ProductModal({ open, product, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(product?.name || "");
    setPrice(product ? String(product.price) : "");
    setDescription(product?.description || "");
    setError("");
  }, [product, open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required");
    if (name.trim().length > 255) return setError("Name is too long (max 255)");
    if (price.trim() === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
      return setError("Enter a valid price");
    }

    setSaving(true);
    try {
      await onSave({ name: name.trim(), price: Number(price), description });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>{product ? "Edit product" : "Add product"}</h3>
        {error && <div className="alert alert-error">{error}</div>}

        <label htmlFor="product-name">Name</label>
        <input id="product-name" required value={name}
          onChange={(e) => setName(e.target.value)} placeholder="Product name" />

        <label htmlFor="product-price">Price</label>
        <input id="product-price" type="number" min="0" step="0.01" required value={price}
          onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />

        <label htmlFor="product-description">Description (optional)</label>
        <textarea id="product-description" rows={3} value={description}
          onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
