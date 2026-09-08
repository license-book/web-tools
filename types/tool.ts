export type ToolCategory = 'image' | 'pdf' | 'text' | 'developer' | 'design' | 'utility';

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  featured?: boolean;
  badge?: string;
  useCases?: string[];
  steps?: string[];
  tips?: string[];
  limitations?: string[];
  privacyNote?: string;
  faq?: ToolFaqItem[];
  relatedSlugs?: string[];
}
