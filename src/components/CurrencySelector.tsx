"use client";

import { useState } from "react";
import { useCurrency, CURRENCIES } from "@/context/CurrencyContext";
import { Check, DollarSign } from "lucide-react";
import styles from "./CurrencySelector.module.css";

export default function CurrencySelector({ currentCurrency }: { currentCurrency: string }) {
  const { currency, setCurrencyCode } = useCurrency();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Use context currency (live) or fall back to server-rendered value
  const activeCurrency = currency.code || currentCurrency;

  const handleChange = async (code: string) => {
    if (code === activeCurrency) return;
    setSaving(true);
    setSaved(false);
    await setCurrencyCode(code);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.cardHeader}>
        <DollarSign size={24} color="#a855f7" />
        <h2>Currency Preference</h2>
        {saving && <span className={styles.savingBadge}>Saving…</span>}
        {saved && <span className={styles.savedBadge}><Check size={12} /> Saved</span>}
      </div>
      <p className={styles.desc}>
        Choose the currency used throughout your expense tracker and PDF exports.
      </p>
      <div className={styles.grid}>
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => handleChange(c.code)}
            className={`${styles.currencyBtn} ${activeCurrency === c.code ? styles.active : ""}`}
          >
            <span className={styles.symbol}>{c.symbol}</span>
            <span className={styles.code}>{c.code}</span>
            <span className={styles.name}>{c.name}</span>
            {activeCurrency === c.code && (
              <span className={styles.checkmark}><Check size={14} /></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
