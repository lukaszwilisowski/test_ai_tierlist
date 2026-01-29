"use client";
import { useState } from "react";
import { CreateItem, Item } from "./schema";

export function ItemCard({
  item,
  onDelete,
  onUpdate,
}: {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editPrice, setEditPrice] = useState(item.price);

  const handleUpdate = () => {
    onUpdate(item._id, { name: editName, price: Number(editPrice) });
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white flex flex-col gap-2">
      <div className="text-6xl text-center mb-2">🥬</div>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border p-1 rounded"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(Number(e.target.value))}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-2 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-bold text-lg">{item.name}</h3>
          {item.description && (
            <p className="text-gray-500 text-sm">{item.description}</p>
          )}
          <p className="text-xl font-bold">${item.price}</p>
          <div
            className={`text-sm font-medium ${
              item.inStock && item.quantity > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {item.inStock && item.quantity > 0
              ? `In Stock (${item.quantity})`
              : "Out of Stock"}
          </div>
          <div className="flex justify-end gap-2 mt-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ItemList({
  items,
  onDelete,
  onUpdate,
}: {
  items: Item[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No items yet</div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

export function AddItemForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: CreateItem) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [inStock, setInStock] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      inStock,
    });
    // Clear form logic should ideally be in useEffect or controlled by parent, but for this exercise:
    // We'll clear it here, or rely on parent to reset/refetch?
    // "Clear form after successful submit" -> The parent usually handles this or we need a way to know it succeeded.
    // Since onSubmit is void here, I'll clear it immediately.
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("0");
    setInStock(true);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg bg-gray-50 mb-6">
      <h3 className="text-lg font-bold mb-4">Add New Spinach</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              <span className="text-sm font-medium">In Stock</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Spinach"}
        </button>
      </div>
    </form>
  );
}
