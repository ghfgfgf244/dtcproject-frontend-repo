"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
// import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-users.module.css";
import { useUser, useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { userService, UserProfile } from "@/services/userService";

// --- Role Mapping ---
// Based on ExtraTypes.cs Enums
const UI_ROLES = [
  { id: 1, name: "Quản trị hệ thống", backendKey: "Admin" },
  { id: 2, name: "Quản lý đào tạo", backendKey: "TrainingManager" },
  { id: 3, name: "Giáo viên", backendKey: "Instructor" },
  { id: 4, name: "Quản lý tuyển sinh", backendKey: "EnrollmentManager" },
  { id: 5, name: "Cộng tác viên", backendKey: "Collaborator" },
  { id: 6, name: "Học viên", backendKey: "Student" },
];

export default function AdminUsersPage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();

  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<number>(6); // Default to Student

  useEffect(() => {
    async function init() {
      if (!isClerkLoaded || !clerkUser) return;
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        // Check if admin
        const me = await userService.getMe();
        setCurrentUserProfile(me);

        if (me?.roleName === "Admin") {
          const allUsers = await userService.getAllUsers();
          setUsers(allUsers);
        }
      } catch (error) {
        console.error("Init Error", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [isClerkLoaded, clerkUser, getToken]);

  const toggleStatus = async (userId: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.toggleUserStatus(userId);
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ));
    } catch (error) {
      alert("Lỗi khi thay đổi trạng thái!");
    }
  };

  const handleUpdateRole = async (userId: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.updateUserRoles(userId, [draftRole]);
      
      // Update local state by re-fetching
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
      setEditingId(null);
      alert("Đã cập nhật quyền thành công!");
    } catch (error) {
      alert("Lỗi khi cập nhật quyền!");
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}"? Hành động này sẽ thực hiện soft-delete.`)) {
      return;
    }

    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.deleteUser(userId);
      
      // Update local state by removing deleted user
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert("Đã xóa người dùng thành công!");
    } catch (error) {
      alert("Lỗi khi xóa người dùng!");
    }
  };

  const getRoleDisplayName = (user: UserProfile) => {
    const backendRole = user.roles?.[0] || user.roleName || "Student";
    const mapped = UI_ROLES.find(r => r.backendKey === backendRole);
    return mapped ? mapped.name : "Học viên";
  };

  if (loading || !isClerkLoaded) {
    return (
      <div className={shellStyles.page}>
        {/* <Sidebar activeKey="admin-users" /> */}
        <div className={shellStyles.loadingContainer}>
           <Loader2 className="animate-spin" size={48} />
           <p>Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  // Guard for Admin Only
  if (currentUserProfile && currentUserProfile.roleName !== "Admin") {
    return (
      <div className={shellStyles.page}>
        {/* <Sidebar activeKey="admin-users" /> */}
        <div className={shellStyles.content} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '20px' }}>
             <ShieldAlert size={64} color="#e11d48" style={{ margin: '0 auto 20px' }} />
             <h2 style={{ fontSize: '24px', color: '#1e293b' }}>Bạn không có quyền truy cập</h2>
             <p style={{ color: '#64748b', marginTop: '10px' }}>Chỉ Quản trị viên cấp cao mới có quyền quản lý người dùng tại đây.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      {/* <Sidebar activeKey="admin-users" /> */}

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <h1>Danh sách người dùng</h1>
            <p>Quản lý tài quản, phân quyền và trạng thái hoạt động.</p>
          </div>
          <button className={styles.createBtn}>
             Tạo tài khoản (Thủ công)
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
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} />
                    ) : (
                      user.fullName[0]
                    )}
                  </div>
                  <strong>{user.fullName}</strong>
                </div>

                <span className={styles.email}>{user.email}</span>

                {isEditing ? (
                  <select
                    className={styles.select}
                    value={draftRole}
                    onChange={(e) => setDraftRole(Number(e.target.value))}
                  >
                    {UI_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.role}>{getRoleDisplayName(user)}</span>
                )}

                <span
                  className={`${styles.status} ${
                    user.isActive ? styles.active : styles.inactive
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleStatus(user.id)}
                  title="Nhấn để đổi trạng thái"
                >
                  {user.isActive ? "Hoạt động" : "Bị khóa"}
                </span>

                <div className={styles.actions}>
                   {isEditing ? (
                     <>
                        <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Hủy</button>
                        <button className={styles.saveBtn} onClick={() => handleUpdateRole(user.id)}>Lưu</button>
                     </>
                   ) : (
                     <>
                        <button className={styles.editBtn} onClick={() => {
                          setEditingId(user.id);
                          const backendRole = user.roles?.[0] || user.roleName || "Student";
                          const roleObj = UI_ROLES.find(r => r.backendKey === backendRole);
                          setDraftRole(roleObj?.id || 6);
                        }}>Sửa</button>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
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
