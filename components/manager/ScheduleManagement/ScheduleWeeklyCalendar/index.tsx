import styles from "./weekly.module.css";
import { ScheduleEvent } from "@/types/schedule";

interface Props {
  currentDate: Date;
  events: ScheduleEvent[];
  onDayClick: (date: Date) => void;
}

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const day = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - day);
  clone.setHours(0, 0, 0, 0);
  return clone;
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

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getBadgeClass(type: ScheduleEvent["eventType"]) {
  switch (type) {
    case "Theory":
      return "bg-blue-100 text-blue-700";
    case "Practice":
      return "bg-emerald-100 text-emerald-700";
    case "Simulator":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getCardClass(type: ScheduleEvent["eventType"]) {
  switch (type) {
    case "Theory":
      return "bg-blue-50 border-blue-500";
    case "Practice":
      return "bg-emerald-50 border-emerald-500";
    case "Simulator":
      return "bg-amber-50 border-amber-500";
    default:
      return "bg-slate-50 border-slate-500";
  }
}

function getEventLabel(type: ScheduleEvent["eventType"]) {
  switch (type) {
    case "Theory":
      return "Ly thuyet";
    case "Practice":
      return "Thuc hanh";
    case "Simulator":
      return "Mo phong";
    case "Exam":
      return "Sat hach";
    default:
      return type;
  }
}

export default function ScheduleWeeklyCalendar({ currentDate, events, onDayClick }: Props) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div className={styles.wrapper}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {weekDays.map((day) => {
          const dateKey = formatDateKey(day);
          const dayEvents = events
            .filter((event) => event.dateKey === dateKey)
            .sort((left, right) => left.startTime.localeCompare(right.startTime));

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick(day)}
              className={`min-h-[320px] rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isSameDate(day, currentDate) ? "border-blue-200 bg-blue-50/30" : "border-slate-200 bg-white"}`}
            >
              <div className="mb-4 border-b border-slate-100 pb-4">
                <p className={`text-xs font-bold uppercase tracking-widest ${isSameDate(day, currentDate) ? "text-blue-600" : "text-slate-400"}`}>
                  {day.toLocaleDateString("vi-VN", { weekday: "long" })}
                </p>
                <p className={`mt-1 text-2xl font-black ${isSameDate(day, currentDate) ? "text-blue-600" : "text-slate-900"}`}>{day.getDate()}</p>
              </div>

              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <div key={event.id} className={`rounded-r-lg border-l-4 p-2 shadow-sm ${getCardClass(event.eventType)}`}>
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${getBadgeClass(event.eventType)}`}>
                        {getEventLabel(event.eventType)}
                      </span>
                    </div>
                    <p className="truncate text-sm font-bold text-slate-900">{event.className}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <span>{event.startTime}</span>
                      <span>-</span>
                      <span>{event.endTime}</span>
                    </div>
                  </div>
                ))}

                {dayEvents.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-400">Chua co lich hoc</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
