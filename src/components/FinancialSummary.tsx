
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  calculateMonthlyIncome,
  calculateYearlyIncome,
  calculateCurrentYearIncome,
  calculateCurrentMonthIncome
} from '@/utils/localStorage';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { YearlyIncome, MonthlyIncome } from '@/types';

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const FinancialSummary = () => {
  const [yearlyData, setYearlyData] = useState<YearlyIncome[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);
  const [currentYearIncome, setCurrentYearIncome] = useState<number>(0);
  
  useEffect(() => {
    const loadData = () => {
      const yearly = calculateYearlyIncome();
      setYearlyData(yearly);
      
      const currentYear = new Date().getFullYear().toString();
      setSelectedYear(
        yearly.some(y => y.year === currentYear) ? currentYear : yearly[0]?.year || currentYear
      );
      
      setCurrentMonthIncome(calculateCurrentMonthIncome());
      setCurrentYearIncome(calculateCurrentYearIncome());
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    if (selectedYear) {
      // Format monthly data for chart display
      const monthly = calculateMonthlyIncome(selectedYear);
      const formattedMonthly = monthly.map(item => ({
        name: monthNames[parseInt(item.month) - 1],
        income: item.amount
      }));
      
      setMonthlyData(formattedMonthly);
    }
  }, [selectedYear, yearlyData]);
  
  // Prepare data for yearly chart
  const yearChartData = yearlyData.map(year => ({
    name: year.year,
    income: year.amount
  }));
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-semibold">{label}</p>
          <p className="text-lawn">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Month</h3>
            <div className="text-3xl font-bold">{formatCurrency(currentMonthIncome)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Year to Date</h3>
            <div className="text-3xl font-bold">{formatCurrency(currentYearIncome)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().getFullYear()} Total
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <Tabs defaultValue="monthly" className="w-full">
          <div className="px-6 pt-6 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            
            {yearlyData.length > 0 && (
              <div className="text-sm">
                <select
                  className="bg-transparent border rounded px-2 py-1"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  {yearlyData.map(year => (
                    <option key={year.year} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <TabsContent value="monthly" className="h-80 mt-6">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `$${value}`}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="income" 
                    fill="hsl(var(--lawn))" 
                    radius={[4, 4, 0, 0]}
                    barSize={35}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available for {selectedYear}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="yearly" className="h-80 mt-6">
            {yearChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearChartData} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `$${value}`}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="income" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No yearly data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default FinancialSummary;
