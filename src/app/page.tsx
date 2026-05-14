import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, Wallet } from "lucide-react";
import styles from "./page.module.css";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>✨ The Ultimate Daily Companion</div>
        <h1 className={styles.title}>
          Plan Your Life.<br />
          <span className="text-gradient">Track Your Expenses.</span>
        </h1>
        <p className={styles.description}>
          A highly secure, beautifully designed tool to help you master your daily routine and manage your finances. Experience a premium tracking experience.
        </p>
        <Link href="/login" className={`btn-primary ${styles.ctaBtn}`}>
          Get Started <ArrowRight size={18} />
        </Link>
      </div>

      <div className={styles.features}>
        <div className="glass-card">
          <CheckCircle className={styles.featureIcon} size={32} />
          <h3 className={styles.featureTitle}>Daily Planner</h3>
          <p className={styles.featureDesc}>
            Stay on top of your daily tasks with our intuitive, animated planning widget.
          </p>
        </div>
        <div className="glass-card">
          <Wallet className={styles.featureIcon} size={32} />
          <h3 className={styles.featureTitle}>Expense Tracker</h3>
          <p className={styles.featureDesc}>
            Simulate connections to your personal bank account and export detailed PDF summaries.
          </p>
        </div>
        <div className="glass-card">
          <ShieldCheck className={styles.featureIcon} size={32} />
          <h3 className={styles.featureTitle}>High Security</h3>
          <p className={styles.featureDesc}>
            Strict session controls limit logins to 3 devices maximum, keeping your data safe.
          </p>
        </div>
      </div>
    </div>
  );
}
