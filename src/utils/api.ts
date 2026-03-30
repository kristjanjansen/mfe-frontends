import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_URL;

export type Bill = {
  id: number;
  title: string;
  amount: number;
  status: string;
};

export function useBills() {
  return useQuery({
    queryKey: ["bills"],
    queryFn: async (): Promise<Bill[]> => {
      const res = await fetch(`${BASE}/api/v2/bills`);
      const json = await res.json();
      return json.data;
    },
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ["bills", id],
    queryFn: async (): Promise<Bill> => {
      const res = await fetch(`${BASE}/api/v2/bills/${id}`);
      const json = await res.json();
      return json.data;
    },
  });
}

export function useDashboardBilling() {
  return useQuery({
    queryKey: ["bills", "dashboard"],
    queryFn: async (): Promise<Bill | null> => {
      const res = await fetch(`${BASE}/api/v2/bills`);
      const json = await res.json();
      return json.data[0] ?? null;
    },
  });
}
