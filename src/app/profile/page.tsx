import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import styles from "./page.module.css";
import { MonitorSmartphone, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile | Tracker.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const activeSessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    orderBy: { lastActive: "desc" },
  });

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <h1 className="text-gradient">Your Profile</h1>
        <p className={styles.subtitle}>Manage your settings and active sessions.</p>
      </header>

      <div className={styles.grid}>
        <div className="glass-card">
          <div className={styles.cardHeader}>
            <ShieldCheck size={24} color="#ec4899" />
            <h2>Account Details</h2>
          </div>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Name</span>
              <span className={styles.detailValue}>{session.user.name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{session.user.email}</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className={styles.cardHeader}>
            <MonitorSmartphone size={24} color="#a855f7" />
            <h2>Active Devices ({activeSessions.length}/3)</h2>
          </div>
          <p className={styles.sessionLimitInfo}>
            You can be logged in on up to 3 devices simultaneously. Logging into a 4th will revoke the oldest session.
          </p>
          <div className={styles.sessionList}>
            {activeSessions.map((s) => (
              <div key={s.id} className={styles.sessionItem}>
                <div className={styles.sessionIcon}>
                  <MonitorSmartphone size={18} />
                </div>
                <div className={styles.sessionInfo}>
                  <p className={styles.deviceInfo}>{s.deviceInfo || "Unknown Device"}</p>
                  <p className={styles.lastActive}>
                    Last active: {format(new Date(s.lastActive), "MMM dd, p")}
                  </p>
                </div>
                {s.sessionToken === (session.user as any).sessionToken && (
                  <span className={styles.currentBadge}>Current</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
