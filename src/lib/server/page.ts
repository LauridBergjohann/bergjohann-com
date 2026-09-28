//lib/interfaces/page.ts
import type { Section, SectionBase } from "$lib/components/sections/interface";

export type Page = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  icon?: string;
  image?: string;
  sections: PageSection[];
  sortOrder?: number;
};

export type PageSection = Section | ModelListSection | PageListSection;

export type ModelListSection = SectionBase & {
  type: "modelList";
  modelIds: string[];
  sort?: "name" | "newest" ;
  showFilters?: boolean;
};

export type PageListSection = SectionBase & {
  type: "pageList";
  pageIds: string[];
};