import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Minus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../App.css';

const ReportsPage = ({ onBack }) => {
  const [reportPeriod, setReportPeriod] = useState('today');

  // Sample data - in real app this would come from database
  const sampleData = {
    today: {
      income: 450000,
      expense: 180000,
      profit: 270000,
      chartData: [
        { name: '08:00', income: 65000, expense: 20000 },
        { name: '10:00', income: 85000, expense: 30000 },
        { name: '12:00', income: 129000, expense: 45000 },
        { name: '14:00', income: 99000, expense: 35000 },
        { name: '16:00', income: 72000, expense: 25000 },
        { name: '18:00', income: 0, expense: 25000 }
      ]
    },
    week: {
      income: 2850000,
      expense: 1200000,
      profit: 1650000,
      chartData: [
        { name: 'ຈັນ', income: 450000, expense: 180000 },
        { name: 'ອັງຄານ', income: 380000, expense: 160000 },
        { name: 'ພຸດ', income: 520000, expense: 200000 },
        { name: 'ພະຫັດ', income: 410000, expense: 170000 },
        { name: 'ສຸກ', income: 680000, expense: 250000 },
        { name: 'ເສົາ', income: 410000, expense: 240000 }
      ]
    },
    month: {
      income: 12500000,
      expense: 5200000,
      profit: 7300000,
      chartData: [
        { name: 'ອາທິດ 1', income: 2850000, expense: 1200000 },
        { name: 'ອາທິດ 2', income: 3200000, expense: 1350000 },
        { name: 'ອາທິດ 3', income: 3100000, expense: 1300000 },
        { name: 'ອາທິດ 4', income: 3350000, expense: 1350000 }
      ]
    },
    year: {
      income: 145000000,
      expense: 62000000,
      profit: 83000000,
      chartData: [
        { name: 'ມ.ກ.', income: 12500000, expense: 5200000 },
        { name: 'ກ.ພ.', income: 11800000, expense: 4900000 },
        { name: 'ມ.ນ.', income: 13200000, expense: 5500000 },
        { name: 'ເມ.ສ.', income: 12900000, expense: 5300000 },
        { name: 'ພ.ພ.', income: 13500000, expense: 5600000 },
        { name: 'ມິ.ຖ.', income: 14200000, expense: 5900000 }
      ]
    }
  };

  const currentData = sampleData[reportPeriod];

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
          </div>
        </CardContent>
      </Card>

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

