"use client";

import { useState } from "react";

interface Item {
  _id: string;
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  quantity: number;
}

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
}

export function ItemCard({ item, onDelete, onUpdate }: ItemCardProps) {
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
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Name"
          />
          <input
            type="text"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Description"
          />
          <input
            type="number"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Price"
          />
          <input
            type="number"
            value={editData.quantity}
            onChange={(e) => setEditData({ ...editData, quantity: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Quantity"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editData.inStock}
              onChange={(e) => setEditData({ ...editData, inStock: e.target.checked })}
            />
            <span>In Stock</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="text-center mb-3">
        <div className="text-6xl mb-2">🥝</div>
        <h3 className="text-xl font-bold">{item.name}</h3>
        {item.description && (
          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</p>
        <p className="text-sm">
          <span className={item.inStock ? "text-green-600" : "text-red-600"}>
            {item.inStock ? "In Stock" : "Out of Stock"}
          </span>
          {" - "}Quantity: {item.quantity}
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
}

export function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl">No items yet</p>
        <p className="text-sm mt-2">Add your first item to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

interface AddItemFormProps {
  onSubmit: (data: Partial<Item>) => void;
  isLoading: boolean;
}

export function AddItemForm({ onSubmit, isLoading }: AddItemFormProps) {
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity *</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.inStock}
            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            disabled={isLoading}
          />
          <label htmlFor="inStock" className="text-sm font-medium">
            In Stock
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Item"}
        </button>
      </div>
    </form>
  );
}