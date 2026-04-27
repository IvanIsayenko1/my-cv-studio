"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useCVDataList } from "@/hooks/cv/use-cv";

import PageContent from "../layout/page-content";
import CVAdd from "./cv-add";
import CVItem from "./cv-item/cv-item";

export default function CVList() {
  const { data: cvList } = useCVDataList();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter CVs by title
  const filteredCVs = cvList.filter((cv) =>
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContent className="space-y-6 py-7 sm:p-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search CVs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 h-10 w-10 flex items-center justify-center transition-colors active:scale-[0.96]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredCVs.length === 0 && searchQuery ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No CVs found matching "{searchQuery}"
          </p>
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-6">
            No CVs yet. Create your first one to get started.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCVs.length > 0 && <CVAdd />}
        {filteredCVs.map((cv, index) => (
          <CVItem key={cv.id} cv={cv} index={index + 1} />
        ))}
      </div>

      {/* Show CVAdd when no CVs exist */}
      {cvList.length === 0 && (
        <div className="flex justify-center pt-8">
          <CVAdd />
        </div>
      )}
    </PageContent>
  );
}
