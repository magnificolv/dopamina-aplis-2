export type Category = 'healthy' | 'neutral' | 'unhealthy';

export interface DopamineSource {
  id: string;
  name: string;
  value: number;
  category: Category;
  icon: string;
}

export interface Snapshot {
  id: string;
  date: string;
  healthScore: number;
  sources: DopamineSource[];
}
