import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Minus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getFinancialSummary } from '../firebase/firestore.js';
import '../App.css';

const ReportsPage = ({ onBack }) => {
  const [reportPeriod, setReportPeriod] = useState('today');
  const [financialData, setFinancialData] = useState({
    income: 0,
    expense: 0,
    profit: 0,
    chartData: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch financial data when period changes
  useEffect(() => {
    fetchFinancialData();
  }, [reportPeriod]);

  const fetchFinancialData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await getFinancialSummary(reportPeriod);
      
      if (result.success) {
        setFinancialData(result.data);
      } else {
        setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້: ' + result.error);
      }
    } catch (error) {
      setError('ເກີດຂໍ້ຜິດພາດ: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = financialData;

  const pieData = [
    { name: 'ລາຍຮັບ', value: currentData.income, color: '#10b981' },
    { name: 'ລາຍຈ່າຍ', value: currentData.expense, color: '#ef4444' }
  ];

  const periodLabels = {
    today: 'ວັນນີ້',
    week: 'ອາທິດນີ້',
    month: 'ເດືອນນີ້',
    year: 'ປີນີ້'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack}
          variant="outline"
          className="bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          ຍ້ອນກັບ
        </Button>
        <h1 className="text-xl font-bold text-white">ລາຍງານ</h1>
        <div className="w-20"></div>
      </div>

      {/* Period Selection */}
      <Card className="border-blue-500 border-2 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="font-medium">ເລືອກໄລຍະເວລາ:</span>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">ວັນນີ້</SelectItem>
                <SelectItem value="week">ອາທິດນີ້</SelectItem>
                <SelectItem value="month">ເດືອນນີ້</SelectItem>
                <SelectItem value="year">ປີນີ້</SelectItem>
              </SelectContent>
            </Select>
            {isLoading && <span className="text-sm text-gray-500">ກຳລັງໂຫຼດ...</span>}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500 border-2 mb-6">
          <CardContent className="p-4">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-green-500 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ລາຍຮັບ{periodLabels[reportPeriod]}</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentData.income.toLocaleString()} ກີບ
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ລາຍຈ່າຍ{periodLabels[reportPeriod]}</p>
                <p className="text-2xl font-bold text-red-600">
                  {currentData.expense.toLocaleString()} ກີບ
                </p>
              </div>
              <Minus className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ກຳໄລ{periodLabels[reportPeriod]}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentData.profit.toLocaleString()} ກີບ
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">ກຣາຟເສັ້ນ - ລາຍຮັບ ແລະ ລາຍຈ່າຍ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} ກີບ`]}
                labelFormatter={(label) => `ເວລາ: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                name="ລາຍຮັບ"
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="ລາຍຈ່າຍ"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="border-orange-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-orange-700">ກຣາຟແທ່ງ - ເປີຍບທຽບລາຍຮັບ ແລະ ລາຍຈ່າຍ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} ກີບ`]}
              />
              <Bar dataKey="income" fill="#10b981" name="ລາຍຮັບ" />
              <Bar dataKey="expense" fill="#ef4444" name="ລາຍຈ່າຍ" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="border-indigo-500 border-2 mb-20">
        <CardHeader>
          <CardTitle className="text-indigo-700">ກຣາຟວົງມົນ - ອັດຕາສ່ວນລາຍຮັບ ແລະ ລາຍຈ່າຍ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toLocaleString()} ກີບ`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toLocaleString()} ກີບ`]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;

