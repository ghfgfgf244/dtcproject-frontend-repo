"use client";

import { useMemo, useState } from "react";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-users.module.css";
import { VenetianMask, LogOut, ShieldAlert } from "lucide-react"; // Import icon mới

type UserRole =
  | "Học sinh"
  | "Giáo viên"
  | "Quản lý trung tâm"
  | "Quản lý đào tạo";

type UserItem = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: "Active" | "Inactive";
};

const initialUsers: UserItem[] = [
  { id: 1, name: "Alex Johnson", email: "alex.j@example.com", avatar: "/instructor-1.jpg", role: "Học sinh", status: "Active" },
  { id: 2, name: "Sophia Martinez", email: "sophia.m@example.com", avatar: "/instructor-2.jpg", role: "Giáo viên", status: "Active" },
  { id: 3, name: "Marcus Chen", email: "marcus.chen@example.com", avatar: "/instructor-3.jpg", role: "Quản lý trung tâm", status: "Inactive" },
  { id: 4, name: "Elena Rossi", email: "elena.rossi@example.com", avatar: "/instructor-4.jpg", role: "Quản lý đào tạo", status: "Active" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<UserItem>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<Partial<UserItem>>({ role: "Học sinh", status: "Active" });

  // STATE CHO TÍNH NĂNG LOGIN ẢO
  const [impersonatedUser, setImpersonatedUser] = useState<UserItem | null>(null);

  const handleLoginAs = (user: UserItem) => {
    if (confirm(`Bạn có muốn đăng nhập ảo với tư cách ${user.name} (${user.role}) không?`)) {
      setImpersonatedUser(user);
      // Logic thực tế: Lưu token/role vào localStorage và redirect
      console.log("Đang giả lập quyền:", user.role);
    }
  };

  const stopImpersonating = () => {
    setImpersonatedUser(null);
  };

  const editingUser = useMemo(() => users.find((user) => user.id === editingId), [users, editingId]);

  const startEdit = (user: UserItem) => {
    setEditingId(user.id);
    setDraft({ ...user });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((user) => user.id === editingUser.id ? { ...user, ...draft } as UserItem : user));
    cancelEdit();
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleFile = (file: File | undefined, onDone: (value: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") onDone(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!createDraft.name || !createDraft.email) return;
    setUsers((prev) => [...prev, {
      id: Math.max(0, ...prev.map((item) => item.id)) + 1,
      name: createDraft.name ?? "User",
      email: createDraft.email ?? "",
      avatar: createDraft.avatar,
      role: (createDraft.role as UserRole) ?? "Học sinh",
      status: (createDraft.status as UserItem["status"]) ?? "Active",
    }]);
    setCreateOpen(false);
    setCreateDraft({ role: "Học sinh", status: "Active" });
  };

  return (
    <div className={shellStyles.page}>
      {/* IMPERSONATION BANNER */}
      {impersonatedUser && (
        <div className="fixed top-0 left-0 w-full bg-amber-500 text-white py-2 px-6 flex justify-between items-center z-[9999] shadow-2xl animate-bounce-short">
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-tighter">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            Đang Login Ảo: {impersonatedUser.name} ({impersonatedUser.role})
          </div>
          <button 
            onClick={stopImpersonating}
            className="bg-white text-amber-600 px-4 py-1 rounded-lg text-xs font-bold hover:bg-amber-50 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> THOÁT GIẢ LẬP
          </button>
        </div>
      )}

      <section className={shellStyles.content} style={impersonatedUser ? { marginTop: '40px' } : {}}>
        <header className={styles.header}>
          <div>
            <h1>Danh sách người dùng</h1>
            <p>Quản lý tài khoản, phân quyền và trạng thái hoạt động.</p>
          </div>
          <button className={styles.createBtn} onClick={() => setCreateOpen(true)}>
            Tạo tài khoản
          </button>
        </header>

        <div className={styles.card}>
          <div className={`${styles.row} ${styles.head}`}>
            <span>STT</span>
            <span>Ảnh & tên</span>
            <span>Email</span>
            <span>Chức vụ</span>
            <span>Trạng thái</span>
            <span>Tùy chọn</span>
          </div>

          {users.map((user, index) => {
            const isEditing = editingId === user.id;
            return (
              <div key={user.id} className={styles.row}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.userCell}>
                  <div className={styles.avatar}>
                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name[0]}
                  </div>
                  {isEditing ? (
                    <input className={styles.input} value={draft.name ?? ""} onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))} />
                  ) : <strong>{user.name}</strong>}
                </div>

                {isEditing ? (
                  <input className={styles.input} value={draft.email ?? ""} onChange={(e) => setDraft(p => ({ ...p, email: e.target.value }))} />
                ) : <span className={styles.email}>{user.email}</span>}

                {isEditing ? (
                  <select className={styles.select} value={draft.role} onChange={(e) => setDraft(p => ({ ...p, role: e.target.value as UserRole }))}>
                    <option value="Học sinh">Học sinh</option>
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="Quản lý trung tâm">Quản lý trung tâm</option>
                    <option value="Quản lý đào tạo">Quản lý đào tạo</option>
                  </select>
                ) : <span className={styles.role}>{user.role}</span>}

                {isEditing ? (
                  <select className={styles.select} value={draft.status} onChange={(e) => setDraft(p => ({ ...p, status: e.target.value as UserItem["status"] }))}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                ) : <span className={`${styles.status} ${user.status === "Active" ? styles.active : styles.inactive}`}>{user.status}</span>}

                <div className={styles.actions}>
                  {isEditing ? (
                    <>
                      <button className={styles.cancelBtn} onClick={cancelEdit}>Hủy</button>
                      <button className={styles.saveBtn} onClick={saveEdit}>Lưu</button>
                    </>
                  ) : (
                    <>
                      {/* NÚT LOGIN ẢO */}
                      {/* <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 border border-blue-200"
                        onClick={() => handleLoginAs(user)}
                        title="Đăng nhập với tư cách user này"
                      >
                        <VenetianMask className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Login</span>
                      </button> */}
                      <button className={styles.editBtn} onClick={() => startEdit(user)}>Sửa</button>
                      <button className={styles.deleteBtn} onClick={() => removeUser(user.id)}>Xóa</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL CREATE (Giữ nguyên) */}
      {createOpen && (
        <div className={styles.modalOverlay} onClick={() => setCreateOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tạo tài khoản</h3>
              <button onClick={() => setCreateOpen(false)}>✕</button>
            </div>
            <div className={styles.modalGrid}>
              <div className={styles.modalField}>
                <span>Họ tên</span>
                <input className={styles.input} value={createDraft.name ?? ""} onChange={(e) => setCreateDraft(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className={styles.modalField}>
                <span>Email</span>
                <input className={styles.input} value={createDraft.email ?? ""} onChange={(e) => setCreateDraft(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className={styles.modalField}>
                <span>Chức vụ</span>
                <select className={styles.select} value={createDraft.role} onChange={(e) => setCreateDraft(p => ({ ...p, role: e.target.value as UserRole }))}>
                  <option value="Học sinh">Học sinh</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Quản lý trung tâm">Quản lý trung tâm</option>
                  <option value="Quản lý đào tạo">Quản lý đào tạo</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setCreateOpen(false)}>Hủy</button>
              <button className={styles.saveBtn} onClick={handleCreate}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}