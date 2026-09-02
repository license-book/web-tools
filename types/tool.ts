export type ToolCategory = 'image' | 'pdf' | 'text' | 'developer' | 'design' | 'utility';

export interface ToolDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  featured?: boolean;
  badge?: string;
}
