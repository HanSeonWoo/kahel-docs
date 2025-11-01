export interface Document {
  id: string;
  title: string;
  description: string;
  date: string;
  path: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  path: string;
  documentCount: number;
  documents: Document[];
  icon?: string;
}

export interface Config {
  categories: Category[];
  recentDocuments: Document[];
  metadata: {
    totalDocuments: number;
    totalCategories: number;
    lastUpdated: string;
  };
}
