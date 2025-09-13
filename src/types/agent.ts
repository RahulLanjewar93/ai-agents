export interface AgentResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface Agent {
  processQuery(query: string): Promise<AgentResponse>;
}
