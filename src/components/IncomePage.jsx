import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save, Edit } from 'lucide-react';
import { addIncome } from '../firebase/firestore';
import { getTranslation } from '../utils/translations.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import '../App.css';

const IncomePage = ({ onBack, onSaveSuccess }) => {
  const { language } = useLanguage();
  const [incomeType, setIncomeType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Pizza specific states
  const [pizzaSize, setPizzaSize] = useState('');
  const [pizzaType, setPizzaType] = useState('');
  const [pizzaTopping, setPizzaTopping] = useState('');
  const [extraCheese, setExtraCheese] = useState(false);

  const incomeTypes = [
    getTranslation(language, "income_pizza_sales"),
    getTranslation(language, "income_salary"),
    getTranslation(language, "income_from_mother"),
    getTranslation(language, "income_other"),
  ];

  const pizzaSizes = [
    { value: 'S', label: 'S (25,000 Kip)' },
    { value: 'M', label: 'M (35,000 Kip)' },
    { value: 'L', label: 'L (45,000 Kip)' },
    { value: 'XL', label: 'XL (55,000 Kip)' },
  ];

  const pizzaTypes = [
    { value: 'regular', label: getTranslation(language, "regular_topping") },
    { value: 'seafood', label: getTranslation(language, "seafood_topping") },
  ];

  const pizzaToppings = [
    { value: 'pepperoni', label: 'Pepperoni' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'mushroom', label: 'Mushroom' },
    { value: 'pineapple', label: 'Pineapple' },
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

  const calculatePizzaPrice = () => {
    let basePrice = 0;
    switch (pizzaSize) {
      case 'S': basePrice = 25000; break;
      case 'M': basePrice = 35000; break;
      case 'L': basePrice = 45000; break;
      case 'XL': basePrice = 55000; break;
      default: basePrice = 0; break;
    }
    if (pizzaType === 'seafood') basePrice += 10000; // Seafood premium
    if (extraCheese) basePrice += 15000;
    return basePrice;
  };

  // Auto-calculate amount when pizza details change
  useEffect(() => {
    if (incomeType === getTranslation(language, "income_pizza_sales") && pizzaSize && pizzaType) {
      const calculatedPrice = calculatePizzaPrice();
      setAmount(calculatedPrice.toString());
    }
  }, [pizzaSize, pizzaType, extraCheese, incomeType, language]);

  const handleSave = async () => {
    if (incomeType === getTranslation(language, "income_pizza_sales")) {
      if (!pizzaSize || !pizzaType || !amount) {
        setMessage(getTranslation(language, "fill_all_pizza_fields"));
        return;
      }
    } else {
      if (!incomeType || !amount) {
        setMessage(getTranslation(language, "fill_all_fields"));
        return;
      }
    }

    setIsLoading(true);
    setMessage('');

    try {
      const incomeData = {
        type: incomeType,
        amount: parseFloat(amount),
        description,
        receiptUrl: receiptFile ? receiptFile.name : null, // Placeholder for actual upload
        ...(incomeType === getTranslation(language, "income_pizza_sales") && {
          pizzaDetails: {
            size: pizzaSize,
            type: pizzaType,
            topping: pizzaTopping,
            extraCheese: extraCheese,
          },
        }),
      };
      const result = await addIncome(incomeData);
      if (result.success) {
        setMessage(getTranslation(language, "save_success"));
        setIncomeType('');
        setAmount('');
        setDescription('');
        setReceiptFile(null);
        setPizzaSize('');
        setPizzaType('');
        setPizzaTopping('');
        setExtraCheese(false);
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
        <h1 className="text-xl font-bold text-white">{getTranslation(language, "add_income")}</h1>
        <div className="w-20"></div>
      </div>

      {/* Income Form */}
      <Card className="border-green-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-green-700">{getTranslation(language, "type")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={incomeType} onValueChange={setIncomeType}>
            <SelectTrigger>
              <SelectValue placeholder={getTranslation(language, "select_income_type_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {incomeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {incomeType === getTranslation(language, "income_pizza_sales") && (
        <Card className="border-orange-500 border-2 mb-6">
          <CardHeader>
            <CardTitle className="text-orange-700">{getTranslation(language, "pizza_details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pizza Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{getTranslation(language, "size")}</label>
              <Select value={pizzaSize} onValueChange={setPizzaSize}>
                <SelectTrigger>
                  <SelectValue placeholder={getTranslation(language, "select_size_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {pizzaSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pizza Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{getTranslation(language, "type")}</label>
              <Select value={pizzaType} onValueChange={setPizzaType}>
                <SelectTrigger>
                  <SelectValue placeholder={getTranslation(language, "select_type_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {pizzaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pizza Topping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{getTranslation(language, "topping_list")}</label>
              <Select value={pizzaTopping} onValueChange={setPizzaTopping}>
                <SelectTrigger>
                  <SelectValue placeholder={getTranslation(language, "select_pizza_topping_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {pizzaToppings.map((topping) => (
                    <SelectItem key={topping.value} value={topping.value}>
                      {topping.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Extra Cheese */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="extraCheese"
                checked={extraCheese}
                onChange={(e) => setExtraCheese(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="extraCheese" className="text-sm font-medium text-gray-700">
                {getTranslation(language, "add_extra_cheese")}
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-blue-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-blue-700">{getTranslation(language, "amount")} ({getTranslation(language, "kip")})</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            placeholder={getTranslation(language, "amount")}
            value={amount}
            onChange={handleAmountChange}
            className="flex-1"
            disabled={incomeType === getTranslation(language, "income_pizza_sales")}
          />
          <p className="text-sm text-gray-500 mt-2">{getTranslation(language, "enter_numbers_only")}</p>
          {incomeType === getTranslation(language, "income_pizza_sales") && (
            <p className="text-sm text-gray-500 mt-2">{getTranslation(language, "price")}: {calculatePizzaPrice().toLocaleString()} {getTranslation(language, "kip")}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "description")}</CardTitle>
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
          {isLoading ? getTranslation(language, "saving") : getTranslation(language, "add_income")}
        </Button>
      </div>
    </div>
  );
};

export default IncomePage;
