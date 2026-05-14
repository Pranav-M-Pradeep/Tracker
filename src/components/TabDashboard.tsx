"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, LayoutDashboard, Wallet } from "lucide-react";
import PlannerWidget from "@/components/PlannerWidget";
import ExpenseDashboard from "@/components/ExpenseDashboard";
import styles from "./TabDashboard.module.css";

type Tab = "planner" | "expenses";

export default function TabDashboard({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("planner");

  return (
    <div className={styles.container}>
      {/* Greeting */}
      <header className={styles.header}>
        <div>
          <h1>
            Welcome back, <span className="text-gradient">{userName || "User"}</span> 👋
          </h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        <button
          id="tab-planner"
          className={`${styles.tab} ${activeTab === "planner" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("planner")}
        >
          <CalendarDays size={18} />
          Daily Planner
        </button>
        <button
          id="tab-expenses"
          className={`${styles.tab} ${activeTab === "expenses" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          <Wallet size={18} />
          Expense Tracker
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        <AnimatePresence mode="wait">
          {activeTab === "planner" ? (
            <motion.div
              key="planner"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className={styles.panel}
            >
              <PlannerWidget />
            </motion.div>
          ) : (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className={styles.panel}
            >
              <ExpenseDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
