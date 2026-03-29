"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-users.module.css";

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
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar: "/instructor-1.jpg",
    role: "Học sinh",
    status: "Active",
  },
  {
    id: 2,
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    avatar: "/instructor-2.jpg",
    role: "Giáo viên",
    status: "Active",
  },
  {
    id: 3,
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    avatar: "/instructor-3.jpg",
    role: "Quản lý trung tâm",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Elena Rossi",
    email: "elena.rossi@example.com",
    avatar: "/instructor-4.jpg",
    role: "Quản lý đào tạo",
    status: "Active",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<UserItem>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<Partial<UserItem>>({
    role: "Học sinh",
    status: "Active",
  });

  const editingUser = useMemo(
    () => users.find((user) => user.id === editingId),
    [users, editingId]
  );

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
    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: draft.name ?? user.name,
              email: draft.email ?? user.email,
              avatar: draft.avatar ?? user.avatar,
              role: (draft.role as UserRole) ?? user.role,
              status: (draft.status as UserItem["status"]) ?? user.status,
            }
          : user
      )
    );
    cancelEdit();
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleFile = (
    file: File | undefined,
    onDone: (value: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onDone(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!createDraft.name || !createDraft.email) return;
    setUsers((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((item) => item.id)) + 1,
        name: createDraft.name ?? "User",
        email: createDraft.email ?? "",
        avatar: createDraft.avatar,
        role: (createDraft.role as UserRole) ?? "Học sinh",
        status: (createDraft.status as UserItem["status"]) ?? "Active",
      },
    ]);
    setCreateOpen(false);
    setCreateDraft({ role: "Học sinh", status: "Active" });
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="admin-users" />

      <section className={shellStyles.content}>
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
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      user.name[0]
                    )}
                  </div>
                  {isEditing ? (
                    <div className={styles.editGroup}>
                      <input
                        className={styles.input}
                        value={draft.name ?? ""}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, name: event.target.value }))
                        }
                      />
                      <label className={styles.uploadBtn}>
                        Upload ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleFile(event.target.files?.[0], (value) =>
                              setDraft((prev) => ({ ...prev, avatar: value }))
                            )
                          }
                        />
                      </label>
                    </div>
                  ) : (
                    <strong>{user.name}</strong>
                  )}
                </div>

                {isEditing ? (
                  <input
                    className={styles.input}
                    value={draft.email ?? ""}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                ) : (
                  <span className={styles.email}>{user.email}</span>
                )}

                {isEditing ? (
                  <select
                    className={styles.select}
                    value={draft.role}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        role: event.target.value as UserRole,
                      }))
                    }
                  >
                    <option value="Học sinh">Học sinh</option>
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="Quản lý trung tâm">Quản lý trung tâm</option>
                    <option value="Quản lý đào tạo">Quản lý đào tạo</option>
                  </select>
                ) : (
                  <span className={styles.role}>{user.role}</span>
                )}

                {isEditing ? (
                  <select
                    className={styles.select}
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        status: event.target.value as UserItem["status"],
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                ) : (
                  <span
                    className={`${styles.status} ${
                      user.status === "Active" ? styles.active : styles.inactive
                    }`}
                  >
                    {user.status}
                  </span>
                )}

                <div className={styles.actions}>
                  {isEditing ? (
                    <>
                      <button
                        className={styles.cancelBtn}
                        onClick={cancelEdit}
                      >
                        Hủy
                      </button>
                      <button className={styles.saveBtn} onClick={saveEdit}>
                        Lưu
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => startEdit(user)}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => removeUser(user.id)}
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

      {createOpen && (
        <div className={styles.modalOverlay} onClick={() => setCreateOpen(false)}>
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Tạo tài khoản</h3>
              <button onClick={() => setCreateOpen(false)}>✕</button>
            </div>

            <div className={styles.modalGrid}>
              <div className={styles.modalField}>
                <span>Ảnh đại diện</span>
                <label className={styles.uploadCard}>
                  {createDraft.avatar ? (
                    <img src={createDraft.avatar} alt="preview" />
                  ) : (
                    <span>Upload ảnh</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleFile(event.target.files?.[0], (value) =>
                        setCreateDraft((prev) => ({ ...prev, avatar: value }))
                      )
                    }
                  />
                </label>
              </div>

              <div className={styles.modalField}>
                <span>Ảnh & tên</span>
                <input
                  className={styles.input}
                  value={createDraft.name ?? ""}
                  onChange={(event) =>
                    setCreateDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Họ tên"
                />
              </div>

              <div className={styles.modalField}>
                <span>Email</span>
                <input
                  className={styles.input}
                  value={createDraft.email ?? ""}
                  onChange={(event) =>
                    setCreateDraft((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Email"
                />
              </div>

              <div className={styles.modalField}>
                <span>Chức vụ</span>
                <select
                  className={styles.select}
                  value={createDraft.role}
                  onChange={(event) =>
                    setCreateDraft((prev) => ({
                      ...prev,
                      role: event.target.value as UserRole,
                    }))
                  }
                >
                  <option value="Học sinh">Học sinh</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Quản lý trung tâm">Quản lý trung tâm</option>
                  <option value="Quản lý đào tạo">Quản lý đào tạo</option>
                </select>
              </div>

              <div className={styles.modalField}>
                <span>Trạng thái</span>
                <select
                  className={styles.select}
                  value={createDraft.status}
                  onChange={(event) =>
                    setCreateDraft((prev) => ({
                      ...prev,
                      status: event.target.value as UserItem["status"],
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setCreateOpen(false)}>
                Hủy
              </button>
              <button className={styles.saveBtn} onClick={handleCreate}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
