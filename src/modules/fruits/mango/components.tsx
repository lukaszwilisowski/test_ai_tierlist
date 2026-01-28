"use client";
import { useState } from "react";

export function ItemCard({ item, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-6xl text-center mb-4">🥭</div>
      <h3 className="text-xl font-semibold">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold">${item.price}</span>
        <span className={item.inStock ? "text-green-600" : "text-red-600"}>
          {item.inStock ? `In Stock (${item.quantity})` : "Out of Stock"}
        </span>
      </div>
      <button
        onClick={() => onDelete(item._id)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
}

export function ItemList({ items, onDelete }: any) {
  if (!items?.length)
    return <p className="text-center py-8 text-gray-500">No items yet</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item: any) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}

export function AddItemForm({ onSubmit, isLoading }: any) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: undefined as any,
    inStock: true,
    quantity: undefined as any,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: "",
      description: "",
      price: undefined as any,
      inStock: true,
      quantity: undefined as any,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-lg space-y-4"
    >
      <h3 className="text-lg font-semibold">Add New Item</h3>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price || ""}
        onChange={(e) =>
          setForm({ ...form, price: parseFloat(e.target.value) || 0 })
        }
        className="w-full px-3 py-2 border rounded"
        required
        min="0"
        step="0.01"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity || ""}
        onChange={(e) =>
          setForm({ ...form, quantity: parseInt(e.target.value) || 0 })
        }
        className="w-full px-3 py-2 border rounded"
        min="0"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.inStock}
          onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
        />{" "}
        In Stock
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
      >
        {isLoading ? "Adding..." : "Add Item"}
      </button>
    </form>
  );
}
