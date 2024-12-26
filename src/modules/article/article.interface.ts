export enum ArticleVisibility {
  Public = 'public',
  Internal = 'internal',
}

export interface Article {
  id: number;
  title: string;
  content: string;
  tags: string[];
  visibility: ArticleVisibility;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}
