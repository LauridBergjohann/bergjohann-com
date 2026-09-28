import type { Section } from "$lib/components/sections/interface";
import type { PageListSection, ModelListSection } from "../server/page";
import type { Breadcrumb } from "./navigation-api";

export type ModelSummary = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  image?: string;
};

export type PageSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;
};

export type ModelListSectionDto =
  Omit<ModelListSection, "modelIds"> & {
    type: "modelList";
    models: ModelSummary[];
  };

export type PageListSectionDto =
  Omit<PageListSection, "pageIds"> & {
    type: "pageList";
    pages: PageSummary[];
  };

export type PageSectionDto =
  Section
  | ModelListSectionDto
  | PageListSectionDto;

// API-Response für eine Kategorie
/*export type PageDto = Omit<Page, "sections"> & {
  sections: PageSectionDto[];
};*/
export type PageDto = {
  id: string;
  slug: string; // voller Pfad mit führendem Slash
  title: string;
  subtitle?: string;
  icon?: string;
  image: string;
  sections: PageSectionDto[];
  parentId?: string | null;
  sortOrder?: number;

  breadcrumb?: Breadcrumb;
};