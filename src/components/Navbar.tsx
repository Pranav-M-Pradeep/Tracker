"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, LayoutDashboard, FileText } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Tracker.
        </Link>
        <div className={styles.links}>
          {session ? (
            <>
              <Link href="/dashboard" className={styles.link}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/expenses" className={styles.link}>
                <FileText size={18} /> Expenses
              </Link>
              <Link href="/instructions" className={styles.link}>
                Instructions
              </Link>
              <Link href="/profile" className={styles.link}>
                <User size={18} /> Profile
              </Link>
              <button onClick={() => signOut()} className={styles.logoutBtn}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
