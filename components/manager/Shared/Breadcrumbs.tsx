import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string; // Nếu không có href, nó sẽ được hiểu là trang hiện tại (chữ đậm, không click được)
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Nếu có link và chưa phải trang cuối -> Hiển thị thẻ Link */}
            {!isLast && item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              /* Nếu là trang cuối hoặc không có link -> Hiển thị text in đậm */
              <span className="text-slate-900 dark:text-white font-medium whitespace-nowrap">
                {item.label}
              </span>
            )}

            {/* Icon mũi tên ngăn cách (Không render ở phần tử cuối cùng) */}
            {!isLast && (
              <span className="material-symbols-outlined text-xs shrink-0">
                chevron_right
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};