import { Clock } from "lucide-react";
import styles from "./calendar.module.css";
import { ScheduleEvent } from "@/types/schedule";

interface Props {
  events: ScheduleEvent[];
  currentDate: Date;
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ["Thu Hai", "Thu Ba", "Thu Tu", "Thu Nam", "Thu Sau", "Thu Bay", "Chu Nhat"];

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const day = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - day);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function addDays(date: Date, amount: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getEventStyle(type: ScheduleEvent["eventType"]) {
  switch (type) {
    case "Theory":
      return "bg-blue-50 border-blue-500 text-blue-800";
    case "Practice":
      return "bg-emerald-50 border-emerald-500 text-emerald-800";
    case "Simulator":
      return "bg-amber-50 border-amber-500 text-amber-800";
    default:
      return "bg-slate-50 border-slate-500 text-slate-800";
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

export default function ScheduleCalendar({ events, currentDate, onDayClick }: Props) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const gridStart = startOfWeek(monthStart);
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));

  return (
    <div className={styles.calendarWrapper}>
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {WEEKDAYS.map((day, index) => (
          <div key={day} className={`border-r border-slate-200 py-3 text-center ${index >= 5 ? "bg-slate-100/50" : ""}`}>
            <span className={`text-[11px] font-black uppercase tracking-widest ${index === 6 ? "text-red-400" : "text-slate-400"}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {cells.map((cellDate) => {
          const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();
          const isToday = isSameDate(cellDate, currentDate);
          const dateKey = formatDateKey(cellDate);
          const dayEvents = events
            .filter((event) => event.dateKey === dateKey)
            .sort((left, right) => left.startTime.localeCompare(right.startTime));

          return (
            <div
              key={dateKey}
              onClick={() => onDayClick(cellDate)}
              className={`${styles.calendarCell} group ${!isCurrentMonth ? styles.prevMonthCell : ""} ${isToday ? "bg-blue-50/20" : ""}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-sm font-bold ${!isCurrentMonth ? "font-medium text-slate-300" : isToday ? "font-black text-blue-600" : "text-slate-600 group-hover:text-blue-600"}`}>
                  {cellDate.getDate()}
                </span>
                {isToday && (
                  <div className="inline-block rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">Hôm nay</div>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className={`rounded-r border-l-4 p-2 shadow-sm ${getEventStyle(event.eventType)}`}>
                    <p className="mb-1 text-[10px] font-black uppercase leading-none">{getEventLabel(event.eventType)}</p>
                    <p className="truncate text-xs font-bold text-slate-800" title={`${event.className}: ${event.courseName}`}>
                      {event.className}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Clock className="h-3 w-3" />
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
                {dayEvents.length > 3 && <p className="text-[10px] font-bold text-slate-400">+{dayEvents.length - 3} lich hoc</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
