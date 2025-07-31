import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Home, 
  Plus, 
  Minus, 
  BarChart3, 
  User, 
  Settings,
  Store,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import IncomePage from './IncomePage.jsx';
import ExpensePage from './ExpensePage.jsx';
import ReportsPage from './ReportsPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import '../App.css';

const MainApp = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [animationText, setAnimationText] = useState('');
  const [storeStatus, setStoreStatus] = useState('ເປີດ');

  const welcomeText = 'ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ຮ້ານ BoyMo Pizza';

  useEffect(() => {
    // Animation effect for welcome text
    let index = 0;
    const interval = setInterval(() => {
      if (index <= welcomeText.length) {
        setAnimationText(welcomeText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    'ເປີດ': 'bg-green-500',
    'ປິດ': 'bg-red-500',
    'ປັບປຸງ': 'bg-yellow-500',
    'ພັກວັນບຸນ': 'bg-blue-500'
  };

  const renderHomePage = () => (
    <div className="space-y-6">
      {/* Animated Welcome Text */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-xl font-bold text-white">
            {animationText}
          </span>
        </div>
      </div>

      {/* Store Status */}
      <Card className="border-red-500 border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span className="font-medium">ສະຖານະຮ້ານ:</span>
            </div>
            <Badge className={`${statusColors[storeStatus]} text-white`}>
              {storeStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setCurrentPage('income')}
          className="h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-2"
        >
          <Plus className="h-6 w-6" />
          <span>ເພີ່ມລາຍຮັບ</span>
        </Button>
        <Button 
          onClick={() => setCurrentPage('expense')}
          className="h-20 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center space-y-2"
        >
          <Minus className="h-6 w-6" />
          <span>ເພີ່ມລາຍຈ່າຍ</span>
        </Button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-green-300 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium">ລາຍຮັບມື້ນີ້:</span>
              </div>
              <span className="text-lg font-bold text-green-600">0 ກີບ</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-300 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Minus className="h-5 w-5 text-red-600" />
                <span className="font-medium">ລາຍຈ່າຍມື້ນີ້:</span>
              </div>
              <span className="text-lg font-bold text-red-600">0 ກີບ</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-300 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium">ກຳໄລມື້ນີ້:</span>
              </div>
              <span className="text-lg font-bold text-blue-600">0 ກີບ</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return renderHomePage();
      case 'income':
        return <IncomePage onBack={() => setCurrentPage('home')} />;
      case 'expense':
        return <ExpensePage onBack={() => setCurrentPage('home')} />;
      case 'reports':
        return <ReportsPage onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('home')} />;
      default:
        return renderHomePage();
    }
  };

  // If not on home page, render the specific page without navigation
  if (currentPage !== 'home') {
    return renderCurrentPage();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-red-500">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl">👩‍🍳</span>
            </div>
            <h1 className="text-xl font-bold text-white">BoyMo Pizza</h1>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
          >
            ອອກຈາກລະບົບ
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {renderCurrentPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-red-500">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            onClick={() => setCurrentPage('home')}
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            className={`flex flex-col items-center space-y-1 h-16 ${
              currentPage === 'home' 
                ? 'bg-red-600 text-white' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">ໜ້າຫຼັກ</span>
          </Button>

          <Button
            onClick={() => setCurrentPage('income')}
            variant={currentPage === 'income' ? 'default' : 'ghost'}
            className={`flex flex-col items-center space-y-1 h-16 ${
              currentPage === 'income' 
                ? 'bg-red-600 text-white' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">ລາຍຮັບ</span>
          </Button>

          <Button
            onClick={() => setCurrentPage('expense')}
            variant={currentPage === 'expense' ? 'default' : 'ghost'}
            className={`flex flex-col items-center space-y-1 h-16 ${
              currentPage === 'expense' 
                ? 'bg-red-600 text-white' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <Minus className="h-5 w-5" />
            <span className="text-xs">ລາຍຈ່າຍ</span>
          </Button>

          <Button
            onClick={() => setCurrentPage('reports')}
            variant={currentPage === 'reports' ? 'default' : 'ghost'}
            className={`flex flex-col items-center space-y-1 h-16 ${
              currentPage === 'reports' 
                ? 'bg-red-600 text-white' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">ລາຍງານ</span>
          </Button>

          <Button
            onClick={() => setCurrentPage('profile')}
            variant={currentPage === 'profile' ? 'default' : 'ghost'}
            className={`flex flex-col items-center space-y-1 h-16 ${
              currentPage === 'profile' 
                ? 'bg-red-600 text-white' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">ໂປຣໄຟລ໌</span>
          </Button>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default MainApp;

