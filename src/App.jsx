import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getFinancialSummary } from '../firebase/firestore';
import { getTranslation } from '../utils/translations.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../App.css';

const ReportsPage = ({ onBack }) => {
  const { language } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const data = await getFinancialSummary(period);
      setSummary(data);
      setLoading(false);
    };
    fetchSummary();
  }, [period]);

  const incomeExpenseData = summary ? [
    { name: getTranslation(language, "total_income"), value: summary.totalIncome, color: '#82ca9d' },
    { name: getTranslation(language, "total_expense"), value: summary.totalExpense, color: '#8884d8' },
  ] : [];

  const incomeByTypeData = summary ? Object.entries(summary.incomeByType).map(([type, amount]) => ({
    name: type,
    value: amount,
  })) : [];

  const expenseByTypeData = summary ? Object.entries(summary.expenseByType).map(([type, amount]) => ({
    name: type,
    value: amount,
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A282CA', '#CA8282'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack}
          variant="outline"
          className="bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {getTranslation(language, "back")}
        </Button>
        <h1 className="text-xl font-bold text-white">{getTranslation(language, "reports")}</h1>
        <div className="w-20"></div>
      </div>

      {/* Report Summary */}
      <Card className="border-blue-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-blue-700">{getTranslation(language, "report_summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder={getTranslation(language, "select_report_period")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{getTranslation(language, "today")}</SelectItem>
              <SelectItem value="this_week">{getTranslation(language, "this_week")}</SelectItem>
              <SelectItem value="this_month">{getTranslation(language, "this_month")}</SelectItem>
              <SelectItem value="this_year">{getTranslation(language, "this_year")}</SelectItem>
            </SelectContent>
          </Select>
          {loading ? (
            <p>{getTranslation(language, "loading")}</p>
          ) : summary ? (
            <div className="mt-4 space-y-2">
              <p>{getTranslation(language, "total_income")}: {summary.totalIncome.toLocaleString()} {getTranslation(language, "kip")}</p>
              <p>{getTranslation(language, "total_expense")}: {summary.totalExpense.toLocaleString()} {getTranslation(language, "kip")}</p>
              <p>{getTranslation(language, "net_profit")}: {(summary.totalIncome - summary.totalExpense).toLocaleString()} {getTranslation(language, "kip")}</p>
            </div>
          ) : (
            <p>{getTranslation(language, "no_data_available")}</p>
          )}
        </CardContent>
      </Card>

      {/* Income vs Expense Chart */}
      <Card className="border-green-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-green-700">{getTranslation(language, "income_vs_expense")}</CardTitle>
        </CardHeader>
        <CardContent>
          {summary && (summary.totalIncome > 0 || summary.totalExpense > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString() + ` ${getTranslation(language, "kip")}`} />
                <Legend />
                <Bar dataKey="value" name={getTranslation(language, "amount")} >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={cell-${index}} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>{getTranslation(language, "no_data_available")}</p>
          )}
        </CardContent>
      </Card>

      {/* Income by Type Chart */}
      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "income_by_type")}</CardTitle>
        </CardHeader>
        <CardContent>
          {incomeByTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => ${name} (${(percent * 100).toFixed(0)}%)}
                >
                  {incomeByTypeData.map((entry, index) => (
                    <Cell key={cell-${index}} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString() + ` ${getTranslation(language, "kip")}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>{getTranslation(language, "no_data_available")}</p>
          )}
        </CardContent>
      </Card>

      {/* Expense by Type Chart */}
      <Card className="border-red-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-red-700">{getTranslation(language, "expense_by_type")}</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseByTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => ${name} (${(percent * 100).toFixed(0)}%)}
                >
                  {expenseByTypeData.map((entry, index) => (
                    <Cell key={cell-${index}} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString() + ` ${getTranslation(language, "kip")}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>{getTranslation(language, "no_data_available")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
