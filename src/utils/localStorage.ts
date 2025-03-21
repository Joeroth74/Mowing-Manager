import { v4 as uuidv4 } from 'uuid';
import { Client, Job, YearlyIncome, MonthlyIncome } from '@/types';

const CLIENTS_KEY = 'lawncare-clients';
const JOBS_KEY = 'lawncare-jobs';

// Client functions
export const getClients = (): Client[] => {
  const clients = localStorage.getItem(CLIENTS_KEY);
  return clients ? JSON.parse(clients) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  
  if (existingIndex >= 0) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }
  
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const deleteClient = (id: string): void => {
  const clients = getClients();
  const filteredClients = clients.filter(client => client.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(filteredClients));
  
  // Also delete all jobs for this client
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.clientId !== id);
  localStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
};

export const getClient = (id: string): Client | undefined => {
  const clients = getClients();
  return clients.find(client => client.id === id);
};

// Job functions
export const getJobs = (): Job[] => {
  const jobs = localStorage.getItem(JOBS_KEY);
  return jobs ? JSON.parse(jobs) : [];
};

export const saveJob = (job: Job): void => {
  const jobs = getJobs();
  const existingIndex = jobs.findIndex(j => j.id === job.id);
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = job;
  } else {
    jobs.push(job);
  }
  
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
};

export const deleteJob = (id: string): void => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  localStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
};

export const getClientJobs = (clientId: string): Job[] => {
  const jobs = getJobs();
  return jobs.filter(job => job.clientId === clientId);
};

export const getJob = (id: string): Job | undefined => {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
};

// Financial calculation functions
export const calculateMonthlyIncome = (year: string): MonthlyIncome[] => {
  const jobs = getJobs().filter(job => {
    if (!job.completed) return false;
    const scheduledDate = new Date(job.scheduledDate);
    const scheduledYear = scheduledDate.getFullYear().toString();
    return scheduledYear === year;
  });
  
  const clients = getClients();
  
  // Initialize all months
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    return {
      month: monthNum.toString().padStart(2, '0'),
      amount: 0
    };
  });
  
  // Calculate income for each month based on scheduled date
  jobs.forEach(job => {
    const scheduledDate = new Date(job.scheduledDate);
    const monthIndex = scheduledDate.getMonth(); // 0-based index
    const client = clients.find(c => c.id === job.clientId);
    
    if (client) {
      months[monthIndex].amount += client.price;
    }
  });
  
  return months;
};

export const calculateYearlyIncome = (): YearlyIncome[] => {
  const jobs = getJobs().filter(job => job.completed);
  const clients = getClients();
  
  const yearMap = new Map<string, number>();
  
  // Calculate total for each year based on scheduled date
  jobs.forEach(job => {
    const scheduledDate = new Date(job.scheduledDate);
    const year = scheduledDate.getFullYear().toString();
    const client = clients.find(c => c.id === job.clientId);
    
    if (client) {
      const currentAmount = yearMap.get(year) || 0;
      yearMap.set(year, currentAmount + client.price);
    }
  });
  
  // Convert to array of YearlyIncome objects
  const yearlyIncomes: YearlyIncome[] = [];
  yearMap.forEach((amount, year) => {
    yearlyIncomes.push({
      year,
      amount,
      monthlyBreakdown: calculateMonthlyIncome(year)
    });
  });
  
  return yearlyIncomes.sort((a, b) => b.year.localeCompare(a.year));
};

export const calculateCurrentYearIncome = (): number => {
  const currentYear = new Date().getFullYear().toString();
  const yearlyData = calculateYearlyIncome();
  const currentYearData = yearlyData.find(data => data.year === currentYear);
  return currentYearData ? currentYearData.amount : 0;
};

export const calculateCurrentMonthIncome = (): number => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonthIndex = currentDate.getMonth(); // 0-based index
  
  const monthlyData = calculateMonthlyIncome(currentYear);
  return monthlyData[currentMonthIndex].amount;
};

export const getUpcomingJobs = (days: number = 7): Job[] => {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);
  
  return getJobs()
    .filter(job => {
      if (job.completed) return false;
      
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= today && jobDate <= endDate;
    })
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
};

export const getClientName = (clientId: string): string => {
  const client = getClient(clientId);
  return client ? client.name : 'Unknown Client';
};
