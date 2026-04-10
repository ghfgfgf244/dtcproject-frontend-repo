"use client";

import React, { useEffect, useState } from "react";
import { X, QrCode, User, Mail, Phone, Save, RefreshCw } from "lucide-react";
import { Collaborator } from "@/types/collaborator";

export interface CollabFormData {
  fullName: string;
  email: string;
  phone: string;
  referralCode: string;
  status: "ACTIVE" | "INACTIVE";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: Collaborator | null;
  onSubmit: (data: CollabFormData) => void;
}

const createSeed = () =>
  Math.random().toString(36).slice(2, 6).toUpperCase();

const buildReferralCode = (fullName: string, seed: string) => {
  const year = new Date().getFullYear();
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const namePart = initials || "CTV";
  return `REF-${year}-${namePart}-${seed}`;
};

export default function CollaboratorModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [seed, setSeed] = useState(createSeed());

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFullName(initialData.fullName);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setReferralCode(initialData.referralCode);
      setIsActive(initialData.status === "ACTIVE");
      setSeed(createSeed());
      return;
    }

    const nextSeed = createSeed();
    setSeed(nextSeed);
    setFullName("");
    setEmail("");
    setPhone("");
    setReferralCode(buildReferralCode("", nextSeed));
    setIsActive(true);
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen || initialData) return;
    setReferralCode(buildReferralCode(fullName, seed));
  }, [fullName, initialData, isOpen, seed]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    const nextSeed = createSeed();
    setSeed(nextSeed);
    setReferralCode(buildReferralCode(fullName, nextSeed));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      fullName,
      email,
      phone,
      referralCode,
      status: isActive ? "ACTIVE" : "INACTIVE",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-8 pb-4 pt-8">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">
              {initialData ? "Cập nhật Cộng tác viên" : "Thêm mới Cộng tác viên"}
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Nhập thông tin chi tiết cho tài khoản cộng tác viên.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition-all hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-8 py-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Họ và tên
              </label>
              <div className="group relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-lg border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Email
                </label>
                <div className="group relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Số điện thoại
                </label>
                <div className="group relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-lg border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Mã giới thiệu
                </label>
                {!initialData && (
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Tạo mã mới
                  </button>
                )}
              </div>
              <div className="group relative">
                <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                <input
                  required
                  type="text"
                  value={referralCode}
                  readOnly={!initialData}
                  onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                  className="w-full rounded-lg border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-mono font-medium uppercase outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {!initialData && (
                <p className="text-[11px] text-slate-500">
                  Mã được tự động tạo theo năm hiện tại, tên cộng tác viên và chuỗi ngẫu nhiên.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <span className="text-xs font-bold text-slate-700">
                  Trạng thái hoạt động
                </span>
                <p className="text-[10px] uppercase tracking-tight text-slate-500">
                  Tài khoản có quyền truy cập hệ thống
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-['']"></div>
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-8 py-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
            >
              <Save className="h-4 w-4" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
