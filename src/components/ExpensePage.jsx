import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { addExpense } from '../firebase/firestore';
import { getTranslation } from '../utils/translations.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import '../App.css';

const ExpensePage = ({ onBack, onSaveSuccess }) => {
  const { language } = useLanguage();
  const [expenseType, setExpenseType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const expenseTypes = [
    getTranslation(language, "raw_materials"),
    getTranslation(language, "packaging"),
    getTranslation(language, "rent"),
    getTranslation(language, "salary"),
    getTranslation(language, "utilities"),
    getTranslation(language, "other_expenses"),
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!expenseType || !amount) {
      setMessage(getTranslation(language, "fill_all_fields"));
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const expenseData = {
        type: expenseType,
        amount: parseFloat(amount),
        description,
        receiptUrl: receiptFile ? receiptFile.name : null, // Placeholder for actual upload
      };
      const result = await addExpense(expenseData);
      if (result.success) {
        setMessage(getTranslation(language, "save_success"));
        setExpenseType('');
        setAmount('');
        setDescription('');
        setReceiptFile(null);
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        setMessage(getTranslation(language, "save_error") + result.error);
      }
    } catch (error) {
      setMessage(getTranslation(language, "save_error") + error.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
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
            {getTranslation(language, "back")}
          </Button>
        <h1 className="text-xl font-bold text-white">{getTranslation(language, "add_new_expense")}</h1>
        <div className="w-20"></div>
      </div>

      {/* Expense Form */}
      <Card className="border-red-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "expense_type")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={expenseType} onValueChange={setExpenseType}>
            <SelectTrigger>
              <SelectValue placeholder={getTranslation(language, "select_expense_type_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {expenseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-green-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-green-700">{getTranslation(language, "amount")} ({getTranslation(language, "kip")})</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            placeholder={getTranslation(language, "amount")}
            value={amount}
            onChange={handleAmountChange}
            className="flex-1"
          />
          <p className="text-sm text-gray-500 mt-2">{getTranslation(language, "enter_numbers_only")}</p>
        </CardContent>
      </Card>

      <Card className="border-blue-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-blue-700">{getTranslation(language, "description")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={getTranslation(language, "enter_description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </CardContent>
      </Card>

      <Card className="border-orange-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-orange-700">{getTranslation(language, "upload_receipt")}</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="receipt-upload"
          />
          <Button
            onClick={() => document.getElementById('receipt-upload').click()}
            variant="outline"
            className="w-full"
          >
            {getTranslation(language, "select_file")}
          </Button>
          {receiptFile && (
            <p className="text-sm text-gray-600 mt-2">{getTranslation(language, "file_selected")}: {receiptFile.name}</p>
          )}
        </CardContent>
      </Card>

      {/* Message Display */}
      {message && (
        <div className={p-3 rounded-lg ${message.includes(getTranslation(language, "save_success")) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}}>
          {message}
        </div>
      )}

      {/* Save Button */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
        >
          {isLoading ? getTranslation(language, "saving") : getTranslation(language, "add_expense")}
        </Button>
      </div>
    </div>
  );
};

export default ExpensePage;
