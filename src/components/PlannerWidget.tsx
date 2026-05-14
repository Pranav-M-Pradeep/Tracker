"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Plus } from "lucide-react";
import styles from "./PlannerWidget.module.css";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

export default function PlannerWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks from API
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      if (res.ok) {
        const addedTask = await res.json();
        setTasks((prev) => [addedTask, ...prev]);
        setNewTask("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = async (id: string, isCompleted: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !isCompleted } : t))
    );
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });
    } catch (e) {
      console.error(e);
      // Revert on failure
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  };

  return (
    <div className={styles.plannerCard}>
      <h2 className="text-gradient" style={{ marginBottom: "1.5rem" }}>
        Daily Planner
      </h2>

      <form onSubmit={addTask} className={styles.addForm}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What's on your mind today?"
          className={`input-field ${styles.input}`}
        />
        <button type="submit" className={`btn-primary ${styles.addBtn}`}>
          <Plus size={20} />
        </button>
      </form>

      {isLoading ? (
        <p className={styles.loading}>Loading plans...</p>
      ) : (
        <div className={styles.taskList}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`${styles.taskItem} ${
                  task.isCompleted ? styles.completed : ""
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.isCompleted)}
                  className={styles.checkBtn}
                >
                  <Check size={16} />
                </button>
                <span className={styles.taskTitle}>{task.title}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className={styles.deleteBtn}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <p className={styles.emptyState}>No plans yet. Add one above!</p>
          )}
        </div>
      )}
    </div>
  );
}
