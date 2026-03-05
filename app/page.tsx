import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined bg-black text-white p-2 rounded-lg">
              search_hands_free
            </span>
            <span className="text-xl font-bold">DriveSafe</span>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cursor-pointer font-medium">
                  Đăng nhập
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold cursor-pointer">
                  Bắt đầu ngay
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold"
              >
                Vào Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full pt-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-6xl font-extrabold leading-tight">
              Làm chủ tay lái, <br />{" "}
              <span className="text-blue-600">Vững tin</span> trên đường.
            </h1>
            <p className="text-gray-500 text-lg">
              Hệ thống quản lý đào tạo lái xe thông minh.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2">
                Đăng ký ngay{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1449960238630-7e720e630019?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover"
              alt="Hero"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
