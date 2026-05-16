"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, LayoutDashboard, FileText, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={close}>
          Tracker.
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          {session ? (
            <>
              <Link href="/dashboard" className={styles.link}><LayoutDashboard size={18} /> Dashboard</Link>
              <Link href="/expenses" className={styles.link}><FileText size={18} /> Expenses</Link>
              <Link href="/instructions" className={styles.link}>Instructions</Link>
              <Link href="/profile" className={styles.link}><User size={18} /> Profile</Link>
              <button onClick={() => signOut()} className={styles.logoutBtn}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.loginBtn}>Login</Link>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {session ? (
            <>
              <Link href="/dashboard" className={styles.mobileLink} onClick={close}><LayoutDashboard size={18} /> Dashboard</Link>
              <Link href="/expenses" className={styles.mobileLink} onClick={close}><FileText size={18} /> Expenses</Link>
              <Link href="/instructions" className={styles.mobileLink} onClick={close}>Instructions</Link>
              <Link href="/profile" className={styles.mobileLink} onClick={close}><User size={18} /> Profile</Link>
              <button onClick={() => { signOut(); close(); }} className={styles.mobileLogout}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.mobileLoginBtn} onClick={close}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
