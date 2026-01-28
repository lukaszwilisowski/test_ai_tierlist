// src/modules/fruits/mango/components.tsx

'use client';

import { useState } from 'react';
import type { Item, CreateItem } from './schema';

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
}

export function ItemCard({ item, onDelete, onUpdate }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="text-xl font-semibold">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mt-2">{item.description}</p>
      )}
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold">${item.price}</span>
        <span
          className={`px-2 py-1 rounded text-sm ${
            item.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {item.inStock ? `In Stock (${item.quantity})` : 'Out of Stock'}
        </span>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onDelete(item._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No mango items yet. Add your first mango or seed data!
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
  onSeed?: () => void;
  isSeedLoading?: boolean;
}

export function AddItemForm({ onSubmit, isLoading, onSeed, isSeedLoading }: AddItemFormProps) {
  const [formData, setFormData] = useState<CreateItem>({
    name: '',
    description: '',
    price: 0,
    image: '',
    inStock: true,
    quantity: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Name is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be positive';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      inStock: true,
      quantity: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add New Mango</h3>
        {onSeed && (
          <button
            type="button"
            onClick={onSeed}
            disabled={isSeedLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {isSeedLoading ? 'Seeding...' : 'Seed Data'}
          </button>
        )}
      </div>
      <div className="grid gap-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-3 py-2 border rounded w-full"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="px-3 py-2 border rounded"
        />
        <div>
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
            }
            className="px-3 py-2 border rounded w-full"
            required
            min="0"
            step="0.01"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <input
          type="url"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
          }
          className="px-3 py-2 border rounded"
          min="0"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) =>
              setFormData({ ...formData, inStock: e.target.checked })
            }
          />
          In Stock
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Adding...' : 'Add Mango'}
        </button>
      </div>
    </form>
  );
}
