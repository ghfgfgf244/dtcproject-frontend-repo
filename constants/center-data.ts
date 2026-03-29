// src/constants/center-data.ts
import { CenterRecord, CenterStatsData } from "@/types/center";

export const MOCK_CENTER_STATS: CenterStatsData = {
  total: 42,
  active: 38,
  suspended: 4
};

export const MOCK_CENTERS: CenterRecord[] = [
  {
    id: "cntr-1",
    code: "CNTR-001",
    name: "Trung Tâm Đào Tạo An Nhiên",
    address: "123 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội",
    phone: "024-3456-7890",
    status: "Hoạt động"
  },
  {
    id: "cntr-2",
    code: "CNTR-002",
    name: "Cơ sở Lái Xe Việt Mỹ",
    address: "45 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh",
    phone: "028-9999-8888",
    status: "Hoạt động"
  },
  {
    id: "cntr-3",
    code: "CNTR-003",
    name: "Trung Tâm Đông Á (Bảo trì)",
    address: "08 Điện Biên Phủ, Thanh Khê, Đà Nẵng",
    phone: "023-1122-3344",
    status: "Tạm dừng"
  },
  {
    id: "cntr-4",
    code: "CNTR-010",
    name: "Driving Center Số 10",
    address: "Đường 30/4, Ninh Kiều, Cần Thơ",
    phone: "029-2223-4445",
    status: "Hoạt động"
  }
];