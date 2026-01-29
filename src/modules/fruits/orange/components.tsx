"use client";

import { useState } from "react";
import type { CreateItem, Item, UpdateItem } from "./schema";

const ICON = "🍊";

type ItemCardProps = {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: UpdateItem) => void;
};

type ItemListProps = {
  items: Item[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: UpdateItem) => void;
};

type AddItemFormProps = {
  onSubmit: (data: CreateItem) => void | Promise<void>;
  isLoading: boolean;
  onSeed?: () => void;
  isSeedLoading?: boolean;
};

export function ItemCard({ item, onDelete, onUpdate }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [price, setPrice] = useState(String(item.price));
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [inStock, setInStock] = useState(item.inStock);

  function handleSave() {
    const payload: UpdateItem = {
      name,
      description: description || undefined,
      price: Number(price),
      quantity: Number(quantity),
      inStock,
    };
    onUpdate(item._id, payload);
    setIsEditing(false);
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col gap-3">
      <div className="text-6xl text-center">{ICON}</div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />
          <textarea
            className="border rounded px-3 py-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border rounded px-3 py-2"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Price"
            />
            <input
              className="border rounded px-3 py-2"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Quantity"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => setInStock(event.target.checked)}
            />
            In Stock
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white rounded px-3 py-2 hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-200 text-gray-800 rounded px-3 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium">${item.price.toFixed(2)}</p>
            <p className={item.inStock ? "text-green-600" : "text-red-600"}>
              {item.inStock ? "In Stock" : "Out of Stock"} · Qty {item.quantity}
            </p>
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(item._id)}
              className="flex-1 bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  if (!items.length) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
        No items yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

export function AddItemForm({
  onSubmit,
  isLoading,
  onSeed,
  isSeedLoading,
}: AddItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [inStock, setInStock] = useState(true);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payload: CreateItem = {
      name,
      description: description || undefined,
      price: Number(price),
      quantity: Number(quantity),
      inStock,
    };

    try {
      const result = onSubmit(payload);
      if (result && typeof (result as Promise<void>).then === "function") {
        await result;
      }
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("0");
      setInStock(true);
    } catch {
      // errors handled by parent
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Name</label>
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Item name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Price</label>
          <input
            className="border rounded px-3 py-2"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Description</label>
          <textarea
            className="border rounded px-3 py-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional description"
            rows={2}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Quantity</label>
          <input
            className="border rounded px-3 py-2"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) => setInStock(event.target.checked)}
          />
          In Stock
        </label>
        <div className="flex items-center gap-2">
          {onSeed && (
            <button
              type="button"
              onClick={onSeed}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              disabled={isSeedLoading}
            >
              {isSeedLoading ? "Seeding..." : "Seed"}
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </div>
    </form>
  );
}
