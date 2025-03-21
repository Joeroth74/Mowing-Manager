
export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  price: number;
  notes?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  scheduledDate: string;
  completed: boolean;
  completedDate?: string;
  paid: boolean;
  paidDate?: string;
  notes?: string;
  createdAt: string;
}

export interface MonthlyIncome {
  month: string;
  amount: number;
}

export interface YearlyIncome {
  year: string;
  amount: number;
  monthlyBreakdown: MonthlyIncome[];
}
