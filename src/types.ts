export interface User {
  id: string;
  email: string;
}

export interface MarkdownFile {
  id: string;
  title: string;
  fileName: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}