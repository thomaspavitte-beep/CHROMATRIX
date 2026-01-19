import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertPalette, type AiSuggestion } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function usePalettes() {
  return useQuery({
    queryKey: [api.palettes.list.path],
    queryFn: async () => {
      const res = await fetch(api.palettes.list.path);
      if (!res.ok) throw new Error("Failed to fetch palettes");
      return api.palettes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePalette() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPalette) => {
      const res = await apiRequest(
        api.palettes.create.method,
        api.palettes.create.path,
        data
      );
      return api.palettes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.palettes.list.path] });
    },
  });
}

export function useAiSuggest() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        api.ai.suggest.method,
        api.ai.suggest.path
      );
      return api.ai.suggest.responses[200].parse(await res.json());
    },
  });
}
