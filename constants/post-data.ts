// src/constants/post-data.ts
import { PostRecord, PostKPIs } from "@/types/post";

export const MOCK_POST_KPIS: PostKPIs = {
  totalActive: 42,
  activeGrowth: "+12%",
  totalRegistrations: 1284,
  regGrowth: "+5.4%",
  avgConversion: 18.5,
  conversionGrowth: "-2.1%"
};

export const MOCK_POSTS: PostRecord[] = [
  {
    id: "post-1",
    title: "Tuyển sinh khóa B2 K84 - Tháng 11/2023",
    code: "TS-B2-8411",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=150&q=80",
    category: "Hạng B2",
    publishedDate: "2023-10-20",
    views: 4250,
    registrations: 128,
    status: "Đang hiển thị"
  },
  {
    id: "post-2",
    title: "Khóa học lái xe tải Hạng C cấp tốc",
    code: "TS-C-0912",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=150&q=80",
    category: "Hạng C",
    publishedDate: "2023-10-18",
    views: 1120,
    registrations: 45,
    status: "Bản nháp"
  },
  {
    id: "post-3",
    title: "Đào tạo B1 số tự động dành cho phái nữ",
    code: "TS-B1-FEM",
    image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=150&q=80",
    category: "Hạng B1",
    publishedDate: "2023-10-15",
    views: 2890,
    registrations: 92,
    status: "Đã ẩn"
  },
  {
    id: "post-4",
    title: "Chương trình ưu đãi giảm 10% học phí B2",
    code: "TS-PROMO-B2",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?w=150&q=80",
    category: "Hạng B2",
    publishedDate: "2023-10-12",
    views: 8400,
    registrations: 312,
    status: "Đang hiển thị"
  }
];