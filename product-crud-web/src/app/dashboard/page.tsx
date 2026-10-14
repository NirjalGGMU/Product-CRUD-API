"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import { Product, ProductInput, User } from "@/types";
import { getAccessToken, getUser } from "@/lib/tokenStorage";
import { logoutUser } from "@/lib/authApi";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/lib/productApi";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    setError("");
    try {
      setProducts(await fetchProducts());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    setUser(getUser());
    void loadProducts();
  }, [router, loadProducts]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleSave = async (input: ProductInput) => {
    if (editing) await updateProduct(editing.id, input);
    else await createProduct(input);
    setModalOpen(false);
    await loadProducts();
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not delete product");
    }
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <main className="container">
        <div className="page-top">
          <div>
            <h1>Products</h1>
            <p className="muted">{products.length} total</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add product</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading ? <div className="empty">Loading...</div> : (
          <ProductTable products={products} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </main>
      <ProductModal
        open={modalOpen}
        product={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
