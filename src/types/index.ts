export type SearchParams = Record<string, string | string[] | undefined>;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface NavItem {
  label: string;
  href: string;
}
