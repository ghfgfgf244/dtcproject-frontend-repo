// components/student/schedule/MilestoneCard.tsx
import React from "react";

export function MilestoneCard() {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
      <h4 className="font-bold text-lg mb-2">Next Milestone</h4>
      <p className="text-white/80 text-sm mb-4">
        You are only 4 practice hours away from your Mock Test!
      </p>
      <div className="w-full bg-white/20 rounded-full h-2 mb-2">
        <div
          className="bg-white h-2 rounded-full transition-all duration-500"
          style={{ width: "75%" }}
        ></div>
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span>36/40 Hours Done</span>
        <span>75%</span>
      </div>
    </div>
  );
}
