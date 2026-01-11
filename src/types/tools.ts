export interface Tool {
  name: string;
  path: string;
  component: React.ComponentType;
  category: string;
  description?: string;
  keywords?: string[];
  icon?: React.ReactNode;
}

export interface ToolCategory {
  name: string;
  components: Tool[];
  icon?: React.ReactNode;
}

export interface ToolConfig {
  name: string;
  path: string;
  component: React.ComponentType;
  description?: string;
  keywords?: string[];
  redirectFrom?: string[];
}