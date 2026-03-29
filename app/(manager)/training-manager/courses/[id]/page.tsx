"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/api';
import CourseDetailClientView from '@/components/manager/CourseManagement/CourseDetail/CourseDetailClientView';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import { Loader2 } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getToken } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      if (id) {
        try {
          const token = await getToken();
          setAuthToken(token);
          const data = await courseService.getCourseById(id);
          setCourse(data);
        } catch (error) {
          console.error("Failed to fetch course detail", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchDetail();
  }, [id, getToken]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-500 font-bold">Không tìm thấy thông tin khóa học.</p>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <CourseDetailClientView course={course} />
      </div>
    </div>
  );
}