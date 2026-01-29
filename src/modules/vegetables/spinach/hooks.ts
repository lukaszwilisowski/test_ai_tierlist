import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/vegetables/spinach";

export function useItems() {
  return useQuery({
    queryKey: ["spinach", "items"],
    queryFn: async () => {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch items");
      return json.data;
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to create item");
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spinach", "items"] });
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update item");
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spinach", "items"] });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete item");
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spinach", "items"] });
    },
  });
}
