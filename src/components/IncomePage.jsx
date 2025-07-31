import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { ArrowLeft, Upload, Save, Edit } from 'lucide-react';
import '../App.css';

const IncomePage = ({ onBack }) => {
  const [incomeType, setIncomeType] = useState('');
  const [pizzaSize, setPizzaSize] = useState('');
  const [pizzaType, setPizzaType] = useState('');
  const [pizzaFlavor, setPizzaFlavor] = useState('');
  const [extraCheese, setExtraCheese] = useState(false);
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const pizzaSizes = {
    '6': { regular: 65000, seafood: 79000 },
    '7': { regular: 85000, seafood: 99000 },
    '9': { regular: 129000, seafood: 139000 },
    '10': { regular: 149000, seafood: 159000 }
  };

  const pizzaFlavors = [
    'ໜ້າລວມມິດຊາລາຍ',
    'ໜ້າຮັອດດ໋ອກຊີສ',
    'ໜ້າເຂົ້າໂພດຫວານ',
    'ໜ້າປູອັດ+ຊີສ',
    'ໜ້າເບຄ້ອນເດິລຸກ',
    'ໜ້າຜັກໂຂມໝາກເຂືອເທດ',
    'ໜ້າຕົ້ມຍຳກຸ້ງ',
    'ໜ້າກຸ້ງເດິລຸກ',
    'ໜ້າແຮມຊີສ',
    'ໜ້າປູອັດ',
    'ໜ້າຮັອດດ໋ອກ',
    'ໜ້າດັບເບີ້ນຊີສ',
    'ໜ້າເບຄ່ອນຊີສ',
    'ໜ້າຮາວາອ້ຽນ',
    'ໜ້າຊີຟູດລວມສະໄປຣຊີ່',
    'ໜ້າລວມໝາກໄມ້'
  ];

  const calculatePizzaPrice = () => {
    if (!pizzaSize || !pizzaType) return 0;
    let basePrice = pizzaSizes[pizzaSize][pizzaType];
    if (extraCheese) basePrice += 15000;
    return basePrice;
  };

  const handleSave = () => {
    if (!amount || amount <= 0) {
      alert('ກະລຸນາປ້ອນຈຳນວນເງິນທີ່ຖືກຕ້ອງ');
      return;
    }

    // Save logic here
    alert('ບັນທຶກລາຍຮັບສຳເລັດ!');
    onBack();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceipt(file);
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
          ຍ້ອນກັບ
        </Button>
        <h1 className="text-xl font-bold text-white">ເພີ່ມລາຍຮັບ</h1>
        <div className="w-20"></div>
      </div>

      <Card className="border-green-500 border-2">
        <CardHeader>
          <CardTitle className="text-green-700">ເລືອກປະເພດລາຍຮັບ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={incomeType} onValueChange={setIncomeType}>
            <SelectTrigger>
              <SelectValue placeholder="ເລືອກປະເພດລາຍຮັບ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pizza">ໄດ້ຮັບຈາກການຂາຍພິຊຊ່າ</SelectItem>
              <SelectItem value="salary">ໄດ້ຮັບຈາກເງິນເດືອນ</SelectItem>
              <SelectItem value="mother">ໄດ້ຮັບຈາກແມ່</SelectItem>
              <SelectItem value="other">ໄດ້ຮັບຈາກອື່ນໆ</SelectItem>
            </SelectContent>
          </Select>

          {incomeType === 'pizza' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">ລາຍລະອຽດພິຊຊ່າ</h3>
              
              {/* Pizza Size */}
              <div>
                <label className="block text-sm font-medium mb-2">ຂະໜາດ:</label>
                <Select value={pizzaSize} onValueChange={setPizzaSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="ເລືອກຂະໜາດ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 ນິ້ວ</SelectItem>
                    <SelectItem value="7">7 ນິ້ວ</SelectItem>
                    <SelectItem value="9">9 ນິ້ວ</SelectItem>
                    <SelectItem value="10">10 ນິ້ວ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pizza Type */}
              <div>
                <label className="block text-sm font-medium mb-2">ປະເພດ:</label>
                <Select value={pizzaType} onValueChange={setPizzaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="ເລືອກປະເພດ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">ໜ້າທຳມະດາ</SelectItem>
                    <SelectItem value="seafood">ໜ້າທະເລ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pizza Flavor */}
              <div>
                <label className="block text-sm font-medium mb-2">ລາຍການໜ້າ:</label>
                <Select value={pizzaFlavor} onValueChange={setPizzaFlavor}>
                  <SelectTrigger>
                    <SelectValue placeholder="ເລືອກໜ້າພິຊຊ່າ" />
                  </SelectTrigger>
                  <SelectContent>
                    {pizzaFlavors.map((flavor, index) => (
                      <SelectItem key={index} value={flavor}>{flavor}</SelectItem>
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
                  className="rounded"
                />
                <label htmlFor="extraCheese" className="text-sm font-medium">
                  ເພີ່ມຊີສ (+15,000 ກີບ)
                </label>
              </div>

              {/* Calculated Price */}
              {pizzaSize && pizzaType && (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="font-semibold text-green-800">
                    ລາຄາ: {calculatePizzaPrice().toLocaleString()} ກີບ
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-2">ຈຳນວນເງິນ (ກີບ):</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={incomeType === 'pizza' ? calculatePizzaPrice().toString() : "ປ້ອນຈຳນວນເງິນ"}
              className="w-full"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium mb-2">ລາຍລະອຽດ:</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມ"
              rows={3}
            />
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">ອັບໂຫຼດໃບບິນ:</label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
              />
              <Button
                onClick={() => document.getElementById('receipt-upload').click()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>ເລືອກໄຟລ໌</span>
              </Button>
              {receipt && (
                <span className="text-sm text-green-600">
                  ເລືອກໄຟລ໌: {receipt.name}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              ບັນທຶກ
            </Button>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>ແກ້ໄຂ</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomePage;

