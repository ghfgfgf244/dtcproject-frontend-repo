"use client";

import { Fragment, useState } from "react";
import styles from "@/styles/admin.module.css";
import StudentDetail from "./details/StudentDetail";
import InstructorDetail from "./details/InstructorDetail";
import CollaboratorDetail from "./details/CollaboratorDetail";
import EnrollmentManagerDetail from "./details/EnrollmentManagerDetail";
import TrainingManagerDetail from "./details/TrainingManagerDetail";

const pageSize = 6;

interface Props {
  role: string;
}

interface User {
  id: number;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UserTable({ role }: Props) {

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const users: User[] = [
    {
      id: 1,
      fullName: "Nguyen Van A",
      role: role,
      email: "a@gmail.com",
      phone: "0123456789",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-02-01",
    },
    {
      id: 2,
      fullName: "Tran Van B",
      role: role,
      email: "b@gmail.com",
      phone: "0987654321",
      isActive: false,
      createdAt: "2024-01-05",
      updatedAt: "2024-02-10",
    },
    {
      id: 3,
      fullName: "Tran Van C",
      role: role,
      email: "c@gmail.com",
      phone: "0123456780",
      isActive: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-02-10",
    },
    {
      id: 4,
      fullName: "Tran Van D",
      role: role,
      email: "d@gmail.com",
      phone: "0123456781",
      isActive: false,
      createdAt: "2024-01-05",
      updatedAt: "2024-02-10",
    },
    {
      id: 5,
      fullName: "Tran Van E",
      role: role,
      email: "e@gmail.com",
      phone: "0123456782",
      isActive: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-02-10",
    },
    {
      id: 6,
      fullName: "Tran Van F",
      role: role,
      email: "f@gmail.com",
      phone: "0123456783",
      isActive: false,
      createdAt: "2024-01-05",
      updatedAt: "2024-02-10",
    },
    {
      id: 7,
      fullName: "Tran Van G",
      role: role,
      email: "g@gmail.com",
      phone: "0123456784",
      isActive: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-02-10",
    },
  ];

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset về page 1 khi search
          }}
          className={styles.searchInput}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((u) => (
            <Fragment key={u.id}>
              <tr
                className={styles.row}
                onClick={() =>
                  setExpandedId(expandedId === u.id ? null : u.id)
                }
              >
                <td>{u.fullName}</td>
                <td>{u.role}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span
                    className={`${styles.badge} ${u.isActive ? styles.active : styles.inactive
                      }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{u.createdAt}</td>
                <td>{u.updatedAt}</td>
              </tr>

              {expandedId === u.id && (
                <tr className={styles.detailRow}>
                  <td colSpan={7}>
                    <div className={styles.detailContainer}>
                      <div className={styles.avatarSection}>
                        <img
                          src="/instructor-1.jpg"
                          alt="User Avatar"
                          className={styles.avatar}
                        />
                      </div>

                      <div className={styles.detailBox}>
                        {role === "Student" && <StudentDetail user={u} />}
                        {role === "Instructor" && <InstructorDetail user={u} />}
                        {role === "Collaborator" && <CollaboratorDetail user={u} />}
                        {role === "Enrollment Manager" && (
                          <EnrollmentManagerDetail user={u} />
                        )}
                        {role === "Training Manager" && (
                          <TrainingManagerDetail user={u} />
                        )}
                      </div>

                      <div className={styles.detailActions}>
                        <button
                          className={styles.editBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Edit user", u.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Delete user", u.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {startIndex + 1}–
          {Math.min(endIndex, users.length)} of {users.length} users
        </div>

        <div className={styles.paginationControls}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                className={
                  page === currentPage ? styles.activePage : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}