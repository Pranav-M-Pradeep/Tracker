"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export interface CurrencyInfo {
  code: string;     // e.g. "USD"
  symbol: string;   // e.g. "$"
  name: string;     // e.g. "US Dollar"
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$",  name: "US Dollar" },
  { code: "EUR", symbol: "€",  name: "Euro" },
  { code: "GBP", symbol: "£",  name: "British Pound" },
  { code: "INR", symbol: "₹",  name: "Indian Rupee" },
  { code: "JPY", symbol: "¥",  name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥",  name: "Chinese Yuan" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼",  name: "Saudi Riyal" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { code: "KRW", symbol: "₩",  name: "South Korean Won" },
];

export function getCurrencyInfo(code: string): CurrencyInfo {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

interface CurrencyContextValue {
  currency: CurrencyInfo;
  setCurrencyCode: (code: string) => Promise<void>;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: CURRENCIES[0],
  setCurrencyCode: async () => {},
  formatAmount: (n) => `$${n.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES[0]);

  // Load the user's saved currency on mount
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.currency) setCurrency(getCurrencyInfo(data.currency));
      })
      .catch(() => {});
  }, [session]);

  const setCurrencyCode = useCallback(async (code: string) => {
    const info = getCurrencyInfo(code);
    setCurrency(info);
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: code }),
    });
  }, []);

  const formatAmount = useCallback(
    (amount: number) => {
      // JPY and KRW don't use decimals
      const noDecimal = ["JPY", "KRW"].includes(currency.code);
      return `${currency.symbol}${noDecimal ? Math.round(amount) : amount.toFixed(2)}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
