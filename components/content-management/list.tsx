"use client";

import { useState } from "react";
import type { ContentItem, ViewMode } from "@/types/content";
import { TableView } from "./table-view";
import { CardView } from "./card-view";
import { ContentPagination } from "./pagination";

interface ContentListProps {
  contentItems: ContentItem[];
  viewMode: ViewMode;
  onViewContent: (content: ContentItem) => void;
  onContentAction: (contentId: string, action: string) => void;
}

export function ContentList({
  contentItems,
  viewMode,
  onViewContent,
  onContentAction,
}: ContentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(contentItems.length / itemsPerPage);
  const paginatedItems = contentItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {viewMode === "table" ? (
        <TableView
        contentItems={paginatedItems}
          onViewContent={onViewContent}
          onContentAction={onContentAction}
        />
      ) : (
        <CardView
        contentItems={paginatedItems}
          onViewContent={onViewContent}
          onContentAction={onContentAction}
        />
      )}

      {/* Pagination */}
      {contentItems.length > 0 && (
        <ContentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={contentItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
