"use client";

import { Product } from "@/types";
import { formatPrice, formatDate } from "@/lib/format";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  if (products.length === 0) {
    return <div className="empty">No products yet. Add your first one!</div>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Description</th><th>Price</th><th>Created</th>
            <th className="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="bold">{p.name}</td>
              <td className="muted">{p.description || "-"}</td>
              <td>{formatPrice(p.price)}</td>
              <td className="muted">{formatDate(p.createdAt)}</td>
              <td className="right">
                <button className="btn btn-small" onClick={() => onEdit(p)}>Edit</button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
