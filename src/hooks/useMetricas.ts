import { useQuery } from "@tanstack/react-query";
import { metricasService } from "../features/metricas/metricasService";

export function useMetricas() {
  return useQuery({
    queryKey: ["metricas-gerais"],
    queryFn: () => metricasService.getMetricasGerais(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000,
  });
}
