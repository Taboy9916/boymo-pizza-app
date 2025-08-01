import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import WelcomePage from './WelcomePage';
import ExpensePage from './ExpensePage';
import IncomePage from './IncomePage';
import ReportsPage from './ReportsPage';
import ProfilePage from './ProfilePage';
import { getFinancialSummary } from '../firebase/firestore';
import { getTranslation } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, TrendingUp, DollarSign, Wallet, User } from 'lucide-react';
import '../App.css';

const MainApp = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    const data = await getFinancialSummary('today');
    setSummary(data);
    setLoadingSummary(false);
  };

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  const handleSaveSuccess = () => {
    fetchSummary();
    setCurrentPage('home');
  };

  if (!user) {
    return <WelcomePage onLoginSuccess={() => setCurrentPage('home')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 p-4">
            <h1 className="text-2xl font-bold text-white mb-6">{getTranslation(language, "home")}</h1>
            <Card className="mb-4 border-green-500 border-2">
              <CardHeader>
                <CardTitle className="text-green-700">{getTranslation(language, "today_income")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <p>{getTranslation(language, "loading")}</p>
                ) : (
                  <p className="text-2xl font-bold">{summary?.totalIncome.toLocaleString() || 0} {getTranslation(language, "kip")}</p>
                )}
              </CardContent>
            </Card>
            <Card className="mb-4 border-red-500 border-2">
              <CardHeader>
                <CardTitle className="text-red-700">{getTranslation(language, "today_expense")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <p>{getTranslation(language, "loading")}</p>
                ) : (
                  <p className="text-2xl font-bold">{summary?.totalExpense.toLocaleString() || 0} {getTranslation(language, "kip")}</p>
                )}
              </CardContent>
            </Card>
            <Card className="mb-4 border-purple-500 border-2">
              <CardHeader>
                <CardTitle className="text-purple-700">{getTranslation(language, "today_profit")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <p>{getTranslation(language, "loading")}</p>
                ) : (
                  <p className="text-2xl font-bold">{(summary?.totalIncome - summary?.totalExpense).toLocaleString() || 0} {getTranslation(language, "kip")}</p>
                )}
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button onClick={() => setCurrentPage('income')} className="bg-green-500 hover:bg-green-600 text-white py-3">
                <DollarSign className="h-5 w-5 mr-2" /> {getTranslation(language, "add_income")}
              </Button>
              <Button onClick={() => setCurrentPage('expense')} className="bg-red-500 hover:bg-red-600 text-white py-3">
                <Wallet className="h-5 w-5 mr-2" /> {getTranslation(language, "add_expense")}
              </Button>
            </div>
          </div>
        );
      case 'income':
        return <IncomePage onBack={() => setCurrentPage('home')} onSaveSuccess={handleSaveSuccess} />;
      case 'expense':
        return <ExpensePage onBack={() => setCurrentPage('home')} onSaveSuccess={handleSaveSuccess} />;
      case 'reports':
        return <ReportsPage onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('home')} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {renderPage()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-blue-600" onClick={() => setCurrentPage('home')}>
            <Home className="h-6 w-6" />
            <span className="text-xs">{getTranslation(language, "home")}</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-blue-600" onClick={() => setCurrentPage('reports')}>
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">{getTranslation(language, "reports")}</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-blue-600" onClick={() => setCurrentPage('profile')}>
            <User className="h-6 w-6" />
            <span className="text-xs">{getTranslation(language, "profile")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
