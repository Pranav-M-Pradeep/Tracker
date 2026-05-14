import styles from "./page.module.css";
import { CheckCircle, Info, Lock, Settings } from "lucide-react";

export const metadata = {
  title: "Instructions | Tracker.",
};

export default function InstructionsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="text-gradient">How to use Tracker.</h1>
        <p className={styles.subtitle}>Your comprehensive guide to mastering the daily planner and expense tracker.</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <CheckCircle size={28} className={styles.icon} />
            <h2>1. Daily Planner</h2>
          </div>
          <p>
            The Daily Planner helps you keep track of your tasks and goals for the day.
          </p>
          <ul className={styles.list}>
            <li><strong>Adding a Task:</strong> Simply type your task into the input field at the top of the planner widget and press Enter or the '+' button.</li>
            <li><strong>Completing a Task:</strong> Click the circular button next to a task to mark it as complete. It will be crossed out.</li>
            <li><strong>Deleting a Task:</strong> Hover over any task and click the trash can icon to permanently remove it from your list.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Info size={28} className={styles.icon} />
            <h2>2. Expense Tracker</h2>
          </div>
          <p>
            Keep your finances in check with the Expense Dashboard. (Currently operating in Mock Mode).
          </p>
          <ul className={styles.list}>
            <li><strong>Adding an Expense:</strong> Click "Add Manual" on the dashboard to input a custom expense. Enter the amount, description, and an optional category.</li>
            <li><strong>Exporting Data:</strong> Need a copy for your records? Click the "Export PDF" button to download a formatted summary of all your recent transactions and your total spending.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Lock size={28} className={styles.icon} />
            <h2>3. Security & Sessions</h2>
          </div>
          <p>
            We take your security seriously. Your account is protected by strict session limits.
          </p>
          <ul className={styles.list}>
            <li><strong>Device Limit:</strong> You can only be logged into Tracker on up to 3 devices simultaneously.</li>
            <li><strong>Automatic Revocation:</strong> If you log into a 4th device, your oldest active session will be automatically securely revoked.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Settings size={28} className={styles.icon} />
            <h2>4. Profile Settings</h2>
          </div>
          <p>
            Navigate to the Profile page to view your account details and manage your active devices. You can see which devices are currently connected and when they were last active.
          </p>
        </section>
      </div>
    </div>
  );
}
