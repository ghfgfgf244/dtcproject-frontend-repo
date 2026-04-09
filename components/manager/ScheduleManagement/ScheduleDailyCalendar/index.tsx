import { BookOpen, Car, ChevronLeft, ChevronRight, Clock, Edit, MapPin, Monitor, Trash2, User } from "lucide-react";
import { ScheduleEvent } from "@/types/schedule";
import styles from "./daily.module.css";

interface Props {
  date: Date;
  events: ScheduleEvent[];
  onDateChange: (newDate: Date) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

function addDays(date: Date, amount: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getEventStyles(type: ScheduleEvent["eventType"]) {
  switch (type) {
    case "Theory":
      return { bg: "bg-blue-50", text: "text-blue-600", border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700", icon: <BookOpen className="h-6 w-6" /> };
    case "Practice":
      return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-l-emerald-500", badge: "bg-emerald-100 text-emerald-700", icon: <Car className="h-6 w-6" /> };
    case "Simulator":
      return { bg: "bg-amber-50", text: "text-amber-600", border: "border-l-amber-500", badge: "bg-amber-100 text-amber-700", icon: <Monitor className="h-6 w-6" /> };
    default:
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-l-slate-500", badge: "bg-slate-100 text-slate-700", icon: <BookOpen className="h-6 w-6" /> };
  }
}

function getEventLabel(type: ScheduleEvent["eventType"]) {
  switch (type) {
    case "Theory":
      return "Lý thuyết";
    case "Practice":
      return "Thực hành";
    case "Simulator":
      return "Mô phỏng";
    case "Exam":
      return "Sát hạch";
    default:
      return type;
  }
}

export default function ScheduleDailyCalendar({ date, events, onDateChange, onEditClick, onDeleteClick }: Props) {
  const weekStrip = Array.from({ length: 7 }, (_, index) => addDays(date, index - 3));

  const morningEvents = events.filter((event) => event.startTime < "12:00");
  const afternoonEvents = events.filter((event) => event.startTime >= "12:00");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <button
          onClick={() => onDateChange(addDays(date, -1))}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="custom-scrollbar flex flex-1 justify-around overflow-x-auto">
          {weekStrip.map((item) => (
            <button
              key={item.toISOString()}
              onClick={() => onDateChange(item)}
              className={`min-w-[50px] rounded-lg p-3 transition-colors ${isSameDate(date, item) ? "border border-blue-200 bg-blue-50 ring-1 ring-blue-200" : "group hover:bg-slate-50"}`}
            >
              <span className={`text-[10px] font-bold uppercase ${isSameDate(date, item) ? "text-blue-600" : "text-slate-400"}`}>
                {item.toLocaleDateString("vi-VN", { weekday: "short" })}
              </span>
              <span className={`mt-1 block text-sm font-black ${isSameDate(date, item) ? "text-blue-600" : "text-slate-900"}`}>{item.getDate()}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onDateChange(addDays(date, 1))}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className={`${styles.timelineGrid} border-b border-slate-100 bg-slate-50/50`}>
          <div className="border-r border-slate-100 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</div>
          <div className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 md:px-8">Chi tiết lớp học</div>
        </div>

        <div className="divide-y divide-slate-100">
          {[...morningEvents, ...afternoonEvents].map((event) => {
            const ui = getEventStyles(event.eventType);

            return (
              <div key={event.id} className={`${styles.timelineGrid} group min-h-[140px] transition-colors hover:bg-slate-50/30`}>
                <div className="flex flex-col items-center border-r border-slate-100 p-4">
                  <span className="text-sm font-black text-slate-900">{event.startTime}</span>
                  <div className="my-2 h-full w-px bg-slate-100 transition-colors group-hover:bg-blue-600/20" />
                </div>

                <div className="relative p-4 md:px-8">
                  <div className={`flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:p-5 ${ui.border}`}>
                    <div className="flex w-full gap-4 md:gap-5">
                      <div className={`${ui.bg} ${ui.text} h-fit shrink-0 rounded-lg p-3`}>{ui.icon}</div>
                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2 md:gap-3">
                          <h4 className="text-base font-bold text-slate-900">{event.className}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${ui.badge}`}>{getEventLabel(event.eventType)}</span>
                        </div>
                        <p className="mb-3 text-sm font-medium text-slate-600">{event.courseName}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 md:gap-6">
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span>GV. {event.instructorName}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1 self-end md:self-start">
                      <button onClick={() => onEditClick(event.id)} className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600" title="Sửa lịch">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => onDeleteClick(event.id)} className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500" title="Xóa lịch">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {events.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">Chưa có lịch học nào trong ngày này.</div>
          )}
        </div>
      </div>
    </div>
  );
}