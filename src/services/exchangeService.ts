import { EXCHANGE_API_KEY, EXCHANGE_BASE_URL } from "../config";

type RatesResponse = {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  base_code: string;
  conversion_rates: Record<string, number>;
};

export async function fetchRates(base = "USD"): Promise<RatesResponse> {
  const url = `${EXCHANGE_BASE_URL}/${EXCHANGE_API_KEY}/latest/${base}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar taxas");
  return res.json();
}

export type PairResponse = {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
  conversion_result?: number; 
};

export async function fetchPair(
  base: string,
  target: string,
  quantity?: number
): Promise<PairResponse> {
  const q = quantity ? `/${quantity}` : "";
  const url = `${EXCHANGE_BASE_URL}/${EXCHANGE_API_KEY}/pair/${base}/${target}${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro na conversão");
  return res.json();
}