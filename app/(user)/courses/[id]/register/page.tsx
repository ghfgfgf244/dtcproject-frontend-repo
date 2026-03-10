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

            <input
              placeholder="Full Name"
              className="input"
            />

            <input
              placeholder="Phone Number"
              className="input"
            />

            <input
              placeholder="Email Address"
              className="input"
            />

            <input
              type="date"
              className="input"
            />

            <input
              placeholder="Residential Address"
              className="input md:col-span-2"
            />

            <input
              placeholder="Citizen ID (CCCD)"
              className="input"
            />

            {/* gender */}
            <div className="flex items-center gap-4 text-sm">

              <label className="flex items-center gap-2">
                <input type="radio" name="gender"/>
                Male
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" name="gender"/>
                Female
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" name="gender"/>
                Other
              </label>

            </div>

          </div>

          {/* terms */}
          <div className="flex items-start gap-2 mt-6 text-sm text-slate-400">
            <input type="checkbox"/>
            <p>
              I agree to the <span className="text-cyan-400">terms and conditions</span>
              {" "}of the training center.
            </p>
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