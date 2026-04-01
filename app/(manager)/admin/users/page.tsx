"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-users.module.css";
import { useUser, useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { userService, UserProfile } from "@/services/userService";

// ===== ROLE MAP =====
const UI_ROLES = [
  { id: 1, name: "Quản trị hệ thống", backendKey: "Admin" },
  { id: 2, name: "Quản lý đào tạo", backendKey: "TrainingManager" },
  { id: 3, name: "Giáo viên", backendKey: "Instructor" },
  { id: 4, name: "Quản lý tuyển sinh", backendKey: "EnrollmentManager" },
  { id: 5, name: "Cộng tác viên", backendKey: "Collaborator" },
  { id: 6, name: "Học viên", backendKey: "Student" },
];

export default function AdminUsersPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<number>(6);

  // ===== GET ROLE NAME =====
  const getRoleDisplayName = (user: UserProfile) => {
    const backendRole = user.roles?.[0] || user.roleName || "Student";
    const roleObj = UI_ROLES.find(r => r.backendKey === backendRole);
    return roleObj?.name || "Học viên";
  };

  // ===== INIT =====
  useEffect(() => {
    async function init() {
      if (!isLoaded || !clerkUser) return;

      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        const me = await userService.getMe();
        setCurrentUser(me);

        if (me?.roleName === "Admin") {
          const allUsers = await userService.getAllUsers();
          setUsers(allUsers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [isLoaded, clerkUser, getToken]);

  // ===== EDIT =====
  const startEdit = (user: UserProfile) => {
    setEditingId(user.id);

    const backendRole = user.roles?.[0] || user.roleName || "Student";
    const roleObj = UI_ROLES.find(r => r.backendKey === backendRole);
    setDraftRole(roleObj?.id || 6);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (userId: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      await userService.updateUserRoles(userId, [draftRole]);

      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);

      cancelEdit();
    } catch {
      alert("Lỗi khi cập nhật quyền!");
    }
  };

  // ===== TOGGLE STATUS =====
  const toggleStatus = async (userId: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      await userService.toggleUserStatus(userId);

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        )
      );
    } catch {
      alert("Lỗi đổi trạng thái");
    }
  };

  // ===== DELETE =====
  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Xóa ${name}?`)) return;

    try {
      const token = await getToken();
      setAuthToken(token);

      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Lỗi xóa user");
    }
  };

  // ===== LOADING =====
  if (loading || !isLoaded) {
    return (
      <div className={shellStyles.page}>
        <div className={shellStyles.loadingContainer}>
          <Loader2 className="animate-spin" size={40} />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  // ===== GUARD =====
  if (currentUser?.roleName !== "Admin") {
    return (
      <div className={shellStyles.page}>
        <div className={shellStyles.content} style={{ textAlign: "center" }}>
          <ShieldAlert size={50} color="red" />
          <h2>Không có quyền truy cập</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Danh sách người dùng</h1>
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
                <span>{index + 1}</span>

                <div className={styles.userCell}>
                  <div className={styles.avatar}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} />
                    ) : (
                      user.fullName[0]
                    )}
                  </div>
                  <strong>{user.fullName}</strong>
                </div>

                <span>{user.email}</span>

                {isEditing ? (
                  <select
                    value={draftRole}
                    onChange={(e) => setDraftRole(Number(e.target.value))}
                  >
                    {UI_ROLES.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{getRoleDisplayName(user)}</span>
                )}

                <span
                  className={`${styles.status} ${
                    user.isActive ? styles.active : styles.inactive
                  }`}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>

                <div className={styles.actions}>
                  {isEditing ? (
                    <>
                      <button onClick={cancelEdit}>Hủy</button>
                      <button onClick={() => saveEdit(user.id)}>Lưu</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(user)}>Sửa</button>
                      <button
                        onClick={() => deleteUser(user.id, user.fullName)}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}