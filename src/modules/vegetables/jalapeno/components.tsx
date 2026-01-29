"use client";
import { useState } from "react";
import type { Item, CreateItem, UpdateItem } from "./schema";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: UpdateItem) => void;
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
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="space-y-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Name"
            required
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Description"
            rows={2}
          />
          <input
            type="number"
            value={editData.price}
            onChange={(e) =>
              setEditData({
                ...editData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border rounded"
            placeholder="Price"
            step="0.01"
            min="0.01"
            required
          />
          <input
            type="number"
            value={editData.quantity}
            onChange={(e) =>
              setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border rounded"
            placeholder="Quantity"
            min="0"
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
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <div className="text-center mb-4">
        <div className="text-6xl">🌶️</div>
      </div>
      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mb-3 text-sm">{item.description}</p>
      )}
      <div className="text-2xl font-bold mb-3">${item.price.toFixed(2)}</div>
      <div className={`text-sm mb-4 ${item.inStock ? "text-green-600" : "text-red-600"}`}>
        {item.inStock ? `In Stock (${item.quantity})` : "Out of Stock"}
      </div>
      <div className="flex gap-2">
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
  onUpdate: (id: string, data: UpdateItem) => void;
}

export function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No items yet</p>
        <p className="text-sm">Add your first item to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

interface AddItemFormProps {
  onSubmit: (data: CreateItem) => void;
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
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm mb-8">
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
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border rounded"
            step="0.01"
            min="0.01"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded"
            min="0"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              disabled={isLoading}
            />
            <span className="text-sm font-medium">In Stock</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Item"}
        </button>
      </div>
    </form>
  );
}
