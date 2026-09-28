import type { Breadcrumb } from "./navigation-api";
import type { MediaElements, Usps } from "../server/model";

export type ModelDto = {
  id: string;
  name: string;
  image: string;
  media?: MediaElements;
  breadcrumb?: Breadcrumb;
  parentId?: string | null;
  description?: string;
  usps?: Usps;
};