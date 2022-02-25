interface Page {
  label: string;
  path: string;
}

export interface Routes {
  title: string;
  pages: Page[];
}
