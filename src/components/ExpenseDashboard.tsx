"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import styles from "./ExpenseDashboard.module.css";
import { useCurrency } from "@/context/CurrencyContext";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface FormState {
  amount: string;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
}

const CATEGORIES_EXPENSE = ["Food", "Transport", "Housing", "Health", "Entertainment", "Shopping", "Education", "Other"];
const CATEGORIES_INCOME = ["Salary", "Freelance", "Investment", "Gift", "Refund", "Other"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const defaultForm = (): FormState => ({
  amount: "",
  description: "",
  category: "",
  type: "expense",
  date: format(new Date(), "yyyy-MM-dd"),
});

export default function ExpenseDashboard() {
  const { formatAmount, currency } = useCurrency();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/expenses?month=${month}&year=${year}`);
      const data = await res.json();
      if (res.ok) setTransactions(data);
    } finally {
      setIsLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  /* ---- Handlers ---- */
  const openAdd = (type: "income" | "expense") => {
    setForm({ ...defaultForm(), type });
    setEditingId(null);
    setModal("add");
  };

  const openEdit = (t: Transaction) => {
    setForm({
      amount: String(t.amount),
      description: t.description,
      category: t.category,
      type: t.type,
      date: format(parseISO(t.date), "yyyy-MM-dd"),
    });
    setEditingId(t.id);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditingId(null);
    setForm(defaultForm());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;

    const payload = {
      amount: parseFloat(form.amount),
      description: form.description,
      category: form.category || "Other",
      type: form.type,
      date: form.date,
    };

    if (modal === "edit" && editingId) {
      const res = await fetch(`/api/expenses/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setTransactions((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      }
    } else {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const added = await res.json();
        const d = new Date(added.date);
        if (d.getMonth() + 1 === month && d.getFullYear() === year) {
          setTransactions((prev) => [added, ...prev]);
        }
      }
    }

    closeModal();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (res.ok) setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDownload = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Finance Summary — ${MONTH_NAMES[month - 1]} ${year}`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Currency: ${currency.name} (${currency.code})`, 14, 28);
    doc.text(`Total Income:   ${formatAmount(totalIncome)}`, 14, 36);
    doc.text(`Total Expenses: ${formatAmount(totalExpense)}`, 14, 43);
    doc.text(`Net Balance:    ${formatAmount(netBalance)}`, 14, 50);

    const rows = transactions.map((t) => [
      format(parseISO(t.date), "MMM dd"),
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      t.description,
      t.category,
      formatAmount(t.amount),
    ]);

    autoTable(doc, {
      startY: 58,
      head: [["Date", "Type", "Description", "Category", "Amount"]],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [168, 85, 247] },
    });

    doc.save(`finance_${year}_${month}.pdf`);
  };

  const categories = form.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  return (
    <div className={styles.wrapper}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h2 className="text-gradient">Expense Tracker</h2>
          <p className={styles.subtitle}>Track your income &amp; spending</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleDownload} className={styles.downloadBtn}>
            <Download size={16} /> <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ── Month Navigator ── */}
      <div className={styles.monthNav}>
        <button onClick={prevMonth} className={styles.navBtn}>
          <ChevronLeft size={20} />
        </button>
        <h3 className={styles.monthLabel}>
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <button onClick={nextMonth} className={styles.navBtn}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.incomeCard}`}>
          <TrendingUp size={22} className={styles.cardIcon} />
          <div>
            <p className={styles.cardLabel}>Total Income</p>
            <p className={styles.cardAmount}>{formatAmount(totalIncome)}</p>
          </div>
        </div>
        <div className={`${styles.summaryCard} ${styles.expenseCard}`}>
          <TrendingDown size={22} className={styles.cardIcon} />
          <div>
            <p className={styles.cardLabel}>Total Expenses</p>
            <p className={styles.cardAmount}>{formatAmount(totalExpense)}</p>
          </div>
        </div>
        <div className={`${styles.summaryCard} ${netBalance >= 0 ? styles.balanceCard : styles.balanceNeg}`}>
          <Wallet size={22} className={styles.cardIcon} />
          <div>
            <p className={styles.cardLabel}>Net Balance</p>
            <p className={styles.cardAmount}>{formatAmount(netBalance)}</p>
          </div>
        </div>
      </div>

      {/* ── Add Buttons ── */}
      <div className={styles.addBtns}>
        <button className={styles.addIncome} onClick={() => openAdd("income")}>
          <Plus size={16} /> Add Income
        </button>
        <button className={styles.addExpense} onClick={() => openAdd("expense")}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* ── Transaction List ── */}
      <div className={styles.txSection}>
        {isLoading ? (
          <p className={styles.empty}>Loading...</p>
        ) : transactions.length === 0 ? (
          <p className={styles.empty}>No transactions for this month.</p>
        ) : (
          <div className={styles.txList}>
            {transactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.txItem}
              >
                <div className={`${styles.txIcon} ${t.type === "income" ? styles.txIconIncome : styles.txIconExpense}`}>
                  {t.type === "income" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div className={styles.txDetails}>
                  <p className={styles.txDesc}>{t.description}</p>
                  <p className={styles.txMeta}>
                    {format(parseISO(t.date), "MMM dd")} &middot; {t.category}
                  </p>
                </div>
                <div className={styles.txRight}>
                  <span className={t.type === "income" ? styles.amountIncome : styles.amountExpense}>
                    {t.type === "income" ? "+" : "-"}{formatAmount(t.amount)}
                  </span>
                  <div className={styles.txActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(t)} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(t.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>
                  {modal === "edit"
                    ? "Edit Transaction"
                    : form.type === "income"
                    ? "Add Income"
                    : "Add Expense"}
                </h3>
                <button onClick={closeModal} className={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className={styles.modalForm}>
                {/* Type Toggle — only for add */}
                {modal === "add" && (
                  <div className={styles.typeToggle}>
                    <button
                      type="button"
                      className={`${styles.typeBtn} ${form.type === "income" ? styles.typeBtnActiveIncome : ""}`}
                      onClick={() => setForm((f) => ({ ...f, type: "income", category: "" }))}
                    >
                      <ArrowUpRight size={16} /> Income
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeBtn} ${form.type === "expense" ? styles.typeBtnActiveExpense : ""}`}
                      onClick={() => setForm((f) => ({ ...f, type: "expense", category: "" }))}
                    >
                      <ArrowDownRight size={16} /> Expense
                    </button>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Amount ({currency.symbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className="input-field"
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="What was this for?"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className={`input-field ${styles.select}`}
                    >
                      <option value="">Select...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className={`input-field ${styles.dateInput}`}
                      required
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn-primary ${form.type === "income" ? styles.saveIncome : styles.saveExpense}`}
                  >
                    {modal === "edit" ? "Save Changes" : `Add ${form.type === "income" ? "Income" : "Expense"}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
