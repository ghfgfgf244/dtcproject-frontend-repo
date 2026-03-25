// src/app/(manager)/enrollment-manager/posts/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import { MOCK_POSTS } from '@/constants/post-data';
import PostClientView from '@/components/manager/PostManagement/PostClientView';

export default function AdmissionPostsPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/enrollment-manager/dashboard' },
    { label: 'Bài đăng Tuyển sinh', href: '/enrollment-manager/posts' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <PostClientView initialPosts={MOCK_POSTS} />
      </div>
    </div>
  );
}