"use client";

import { useParams, useRouter } from "next/navigation";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        {/* COURSE HERO */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700">
          <img
            src="/CourseImage.jpg"
            className="w-full h-56 object-cover opacity-60"
          />

          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-linear-to-t from-black/70">

            <span className="bg-cyan-500 text-black text-xs px-3 py-1 rounded-full w-fit mb-2 font-semibold">
              PROFESSIONAL LICENSE
            </span>

            <h1 className="text-3xl font-bold">
              B2 Driving Course
            </h1>

            {/* course info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">

              <div className="bg-slate-800/60 p-3 rounded-xl">
                <p className="text-slate-400">Duration</p>
                <p className="font-semibold">3 tháng</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl">
                <p className="text-slate-400">Tuition Fee</p>
                <p className="font-semibold">12.000.000 VNĐ</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl">
                <p className="text-slate-400">Start Date</p>
                <p className="font-semibold">15/04/2026</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl">
                <p className="text-slate-400">Location</p>
                <p className="font-semibold">Hà Nội Campus</p>
              </div>

            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-2">
            Student Information
          </h2>

          <p className="text-slate-400 mb-6 text-sm">
            Please provide your details exactly as they appear on your ID documents.
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Personal Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                Personal Information
              </h3>
            </div>

            <input
              placeholder="Full Name"
              className="input"
            />

            <input
              type="date"
              className="input uppercase text-slate-400"
            />

            <div className="flex items-center gap-6 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">Gender:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-cyan-500 w-4 h-4" />
                Male
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-cyan-500 w-4 h-4" />
                Female
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-cyan-500 w-4 h-4" />
                Other
              </label>
            </div>

            <input
              placeholder="Phone Number"
              className="input"
            />

            <input
              placeholder="Email Address"
              className="input"
            />

            <input
              placeholder="Residential Address"
              className="input"
            />

            {/* Documents Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                Required Documents
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Please upload clear, legible photos. Max size 5MB per file.
              </p>
            </div>

            {/* Upload Grids */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">Personal Photo (Portrait)</span>
              <label className="border border-dashed border-slate-600 rounded-xl p-4 text-center hover:bg-slate-700/50 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-900/30">
                <span className="text-2xl mb-1">📸</span>
                <span className="text-xs text-slate-400">Click to upload photo</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">Citizen ID (Front)</span>
              <label className="border border-dashed border-slate-600 rounded-xl p-4 text-center hover:bg-slate-700/50 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-900/30">
                <span className="text-2xl mb-1">🪪</span>
                <span className="text-xs text-slate-400">Upload Front Side</span>
                <input type="file" accept="image/*" required className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 md:w-1/2 md:pr-3">
              <span className="text-sm font-medium text-slate-300">Citizen ID (Back)</span>
              <label className="border border-dashed border-slate-600 rounded-xl p-4 text-center hover:bg-slate-700/50 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-900/30">
                <span className="text-2xl mb-1">🪪</span>
                <span className="text-xs text-slate-400">Upload Back Side</span>
                <input type="file" accept="image/*" required className="hidden" />
              </label>
            </div>

          </div>

          {/* terms */}
          <div className="mt-8 pt-4 border-t border-slate-700">
            <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer w-fit">
              <input type="checkbox" className="w-4 h-4 accent-cyan-500 rounded border-slate-600 bg-slate-900" />
              <span>
                I agree to the <span className="text-cyan-400 hover:underline">terms and conditions</span> of the training center.
              </span>
            </label>
          </div>

          {/* buttons */}
          <div className="flex justify-end gap-4 mt-8">

            <button
              onClick={() => router.back()}
              className="px-5 py-2 rounded-xl border border-slate-600 hover:bg-slate-700"
            >
              Back
            </button>

            <button
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              Register Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}