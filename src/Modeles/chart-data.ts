export interface ChartData {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  }