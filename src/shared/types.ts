export interface RegistryMCPServerParameter {
  type: string;
  required: boolean;
  description: string;
}

export interface MCPParameters {
  [key: string]: RegistryMCPServerParameter;
}

export interface MCPCommandInfo {
  command: string;
  args: string[];
  env: {
    [key: string]: string;
  };
}

export interface MCPSources {
  github?: string;
  npm?: string;
}

export interface RegistryMCPServerItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  creator: string;
  logoUrl?: string;
  publishDate: string;
  rating: number;
  sources?: MCPSources;
  type: 'stdio';
  commandInfo: MCPCommandInfo;
  defVersion: string;
  parameters: MCPParameters;
}
