"use client";

import { useParams, useRouter } from "next/navigation";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        {/* COURSE HERO */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src="/CourseImage.jpg"
            className="w-full h-56 object-cover opacity-70"
          />

          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-linear-to-t from-white/80">

            <span className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full w-fit mb-2 font-semibold">
              PROFESSIONAL LICENSE
            </span>

            <h1 className="text-3xl font-bold">
              B2 Driving Course
            </h1>

            {/* course info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm text-slate-700">

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500">Duration</p>
                <p className="font-semibold">3 tháng</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500">Tuition Fee</p>
                <p className="font-semibold">12.000.000 VNĐ</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500">Start Date</p>
                <p className="font-semibold">15/04/2026</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500">Location</p>
                <p className="font-semibold">Hà Nội Campus</p>
              </div>

            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

          <h2 className="text-2xl font-semibold mb-2">
            Student Information
          </h2>

          <p className="text-slate-500 mb-6 text-sm">
            Please provide your details exactly as they appear on your ID documents.
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Personal Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Personal Information
              </h3>
            </div>

            <input
              placeholder="Full Name"
              className="input bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-400"
            />

            <input
              type="date"
              className="input uppercase text-slate-500 bg-white border-slate-200 focus:border-sky-400"
            />

            <div className="flex items-center gap-6 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Gender:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-sky-500 w-4 h-4" />
                Male
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-sky-500 w-4 h-4" />
                Female
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-sky-500 w-4 h-4" />
                Other
              </label>
            </div>

            <input
              placeholder="Phone Number"
              className="input bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-400"
            />

            <input
              placeholder="Email Address"
              className="input bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-400"
            />

            <input
              placeholder="Residential Address"
              className="input bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-400"
            />

            {/* Documents Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Required Documents
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Please upload clear, legible photos. Max size 5MB per file.
              </p>
            </div>

            {/* Upload Grids */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">Personal Photo (Portrait)</span>
              <label className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-100 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-50">
                <span className="text-2xl mb-1">📸</span>
                <span className="text-xs text-slate-500">Click to upload photo</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">Citizen ID (Front)</span>
              <label className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-100 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-50">
                <span className="text-2xl mb-1">🪪</span>
                <span className="text-xs text-slate-500">Upload Front Side</span>
                <input type="file" accept="image/*" required className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 md:w-1/2 md:pr-3">
              <span className="text-sm font-medium text-slate-600">Citizen ID (Back)</span>
              <label className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-100 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-50">
                <span className="text-2xl mb-1">🪪</span>
                <span className="text-xs text-slate-500">Upload Back Side</span>
                <input type="file" accept="image/*" required className="hidden" />
              </label>
            </div>

          </div>

          {/* terms */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer w-fit">
              <input type="checkbox" className="w-4 h-4 accent-sky-500 rounded border-slate-300 bg-white" />
              <span>
                I agree to the <span className="text-sky-600 hover:underline">terms and conditions</span> of the training center.
              </span>
            </label>
          </div>

          {/* buttons */}
          <div className="flex justify-end gap-4 mt-8">

            <button
              onClick={() => router.back()}
              className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Back
            </button>

            <button
              className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold"
            >
              Register Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
