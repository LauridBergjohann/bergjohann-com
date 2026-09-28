export interface NavigationEntry {
    label: string;
    href: string;
    icon?: string;
    children?: NavigationEntry[];
}

export type Breadcrumb = BreadcrumbElement[];
export type BreadcrumbElement = {
    label: string;
    href?: string; // letzter Eintrag hat meist kein href
    ariaLabel?: string;
  };