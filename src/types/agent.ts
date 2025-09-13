export interface AgentResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface Agent {
  processQuery(query: string): Promise<AgentResponse>;
}
