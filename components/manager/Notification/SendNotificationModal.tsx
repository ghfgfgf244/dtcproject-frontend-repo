'use client';

import React, { FormEvent } from 'react';
import styles from './SendNotificationModal.module.css';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendNotificationModal = ({ isOpen, onClose }: SendNotificationModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Notification Sent:', Object.fromEntries(formData.entries()));
    onClose();
  };

  return (
    <div className={`${styles.overlay} bg-slate-900/40 backdrop-blur-[2px]`}>
      <div className={`${styles.modalContainer} bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200`}>
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Send Notification</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Broadcast a message to specific roles or centers.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <div className={styles.modalBody}>
            
            {/* Target Role */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Target Audience <span className="text-red-500">*</span></label>
              <select name="roleTarget" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required>
                <option value="All">All Users</option>
                <option value="Student">Students Only</option>
                <option value="Instructor">Instructors Only</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" placeholder="e.g. Campus closed for holiday" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Message Content <span className="text-red-500">*</span></label>
              <textarea name="content" rows={4} placeholder="Type your message here..." className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none resize-none" required></textarea>
            </div>

          </div>

          <div className={`${styles.modalFooter} border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900`}>
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">send</span> Send Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};