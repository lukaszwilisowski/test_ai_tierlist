import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateItem, UpdateItem } from "./schema";

const API_BASE = "/api/vegetables/broccoli";

export function useItems() {
  return useQuery({
    queryKey: ["broccoli", "items"],
    queryFn: async () => {
      const response = await fetch(API_BASE);
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch items");
      }
      return json.data;
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateItem) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to create item");
      }
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broccoli", "items"] });
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItem }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to update item");
      }
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broccoli", "items"] });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to delete item");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broccoli", "items"] });
    },
  });
}
