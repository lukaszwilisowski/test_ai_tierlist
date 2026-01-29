'use client';

import { useState } from 'react';
import type { Item, CreateItem, UpdateItem } from './schema';

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: UpdateItem) => void;
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: UpdateItem) => void;
}

interface AddItemFormProps {
  onSubmit: (data: CreateItem) => Promise<void> | void;
  isLoading?: boolean;
}

export function ItemCard({ item, onDelete, onUpdate }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? '');
  const [price, setPrice] = useState(item.price.toString());
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [inStock, setInStock] = useState(item.inStock);

  const handleSave = () => {
    const nextPrice = Number(price);
    const nextQuantity = Number(quantity);
    onUpdate(item._id, {
      name,
      description: description || undefined,
      price: Number.isNaN(nextPrice) ? item.price : nextPrice,
      quantity: Number.isNaN(nextQuantity) ? item.quantity : nextQuantity,
      inStock,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-center text-6xl">🍓</div>
      {isEditing ? (
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <textarea
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={price}
            type="number"
            min="0"
            step="0.01"
            onChange={(event) => setPrice(event.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={quantity}
            type="number"
            min="0"
            step="1"
            onChange={(event) => setQuantity(event.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => setInStock(event.target.checked)}
            />
            In stock
          </label>
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col gap-2 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {item.description || 'No description'}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            ${item.price.toFixed(2)}
          </p>
          <span
            className={`text-sm font-medium ${
              item.inStock ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.inStock ? 'In Stock' : 'Out of Stock'} · {item.quantity}
          </span>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {isEditing ? (
          <button
            type="button"
            className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="flex-1 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
          onClick={() => onDelete(item._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        No items yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

export function AddItemForm({ onSubmit, isLoading = false }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [inStock, setInStock] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name,
      description: description || undefined,
      price: Number(price),
      quantity: Number(quantity),
      inStock,
    });
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('0');
    setInStock(true);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) => setInStock(event.target.checked)}
          />
          In stock
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add item'}
      </button>
    </form>
  );
}
