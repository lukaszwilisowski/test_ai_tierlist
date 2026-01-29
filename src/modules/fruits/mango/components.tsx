"use client";
import { useState } from "react";
import { Item } from "./schema";

export function ItemCard({ item, onDelete, onUpdate }: { item: Item; onDelete: (id: string) => void; onUpdate: (id: string, data: Partial<Item>) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    description: item.description || "",
    price: item.price,
    quantity: item.quantity,
    inStock: item.inStock,
  });

  const handleUpdate = () => {
    onUpdate(item._id, editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="space-y-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Name"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Description"
            rows={3}
          />
          <input
            type="number"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Price"
            step="0.01"
            min="0"
          />
          <input
            type="number"
            value={editData.quantity}
            onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Quantity"
            min="0"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editData.inStock}
              onChange={(e) => setEditData({ ...editData, inStock: e.target.checked })}
              className="rounded"
            />
            <span>In Stock</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">🥭</div>
        <h3 className="text-xl font-bold">{item.name}</h3>
        {item.description && (
          <p className="text-gray-600 mt-2">{item.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-center">
          ${item.price.toFixed(2)}
        </div>
        <div className={`text-center font-medium ${item.inStock ? "text-green-600" : "text-red-600"}`}>
          {item.inStock ? `In Stock (${item.quantity})` : "Out of Stock"}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function ItemList({ items, onDelete, onUpdate }: { items: Item[]; onDelete: (id: string) => void; onUpdate: (id: string, data: Partial<Item>) => void }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No items yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

export function AddItemForm({ onSubmit, isLoading }: { onSubmit: (data: FormData) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    inStock: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      inStock: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Add New Item</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            step="0.01"
            min="0"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            min="0"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="rounded"
              disabled={isLoading}
            />
            <span className="text-sm font-medium">In Stock</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Item"}
        </button>
      </div>
    </form>
  );
}

type FormData = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  inStock: boolean;
};
