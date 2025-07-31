import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { ArrowLeft, Upload, Save, Edit } from 'lucide-react';
import '../App.css';

const ExpensePage = ({ onBack }) => {
  const [expenseType, setExpenseType] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const expenseItems = [
    'ເຕົາອົບສະແຕນເລດ',
    'ວັດຖຸດິບ',
    'ແປ້ງພິຊຊ່າສຳເລັດຮູບ ໄຊ້ 6ນິ້ວ',
    'ແປ້ງພິຊຊ່າສຳເລັດຮູບ ໄຊ້ 7ນິ້ວ',
    'ແປ້ງພິຊຊ່າສຳເລັດຮູບ ໄຊ້ 9ນິ້ວ',
    'ແປ້ງພິຊຊ່າສຳເລັດຮູບ ໄຊ້ 10ນິ້ວ',
    'ຊອສທາວາຊັ່ນ',
    'ຊອສພິຊຊ່າສູດພິເສດ (ໝາກເລັ່ນ)',
    'ຊອສມາຢອງເນສ',
    'ຊອສລາດໜ້າພິຊຊ່າ',
    'ຊີສກ້ອນໃຫຍ່',
    'ເຫຼັກຕັດພິຊຊ່າ',
    'ເຈ້ຍຮອງພິຊຊ່າ',
    'ຊອສ Rosa ແດງ',
    'ຊອສ Rosa ຂຽວ',
    'ສາລ່າຍ',
    'ອາລິກາໂນ',
    'ຖາດຮອງແຕ່ງໜ້າພິຊຊ່າ',
    'ປູອັດເບນໂຕະ',
    'ກຸ້ງ',
    'ໝາກນັດ',
    'ໝາກເພັດໃຫຍ່',
    'ໝາກເລັ່ນ',
    'ຮັອດດ໋ອກ',
    'ແຮ໋ມໝູ+ໄກ່',
    'ນ້ຳມັນລົດ',
    'ປາມຶກວົງ',
    'ປາມຶກລາຍ',
    'ອັນຂູດຊີສ',
    'ຊີສເປັນກ້ອນ',
    'ແນວຊ້ອນພິຊຊ່າ',
    'ລາຍການອື່ນໆ'
  ];

  const handleSave = () => {
    if (!expenseType) {
      alert('ກະລຸນາເລືອກປະເພດລາຍຈ່າຍ');
      return;
    }
    if (!amount || amount <= 0) {
      alert('ກະລຸນາປ້ອນຈຳນວນເງິນທີ່ຖືກຕ້ອງ');
      return;
    }

    // Validate amount is a number
    if (isNaN(parseFloat(amount))) {
      alert('ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ');
      return;
    }

    // Save logic here
    alert('ບັນທຶກລາຍຈ່າຍສຳເລັດ!');
    onBack();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceipt(file);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
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
        <h1 className="text-xl font-bold text-white">ເພີ່ມລາຍຈ່າຍ</h1>
        <div className="w-20"></div>
      </div>

      <Card className="border-red-500 border-2">
        <CardHeader>
          <CardTitle className="text-red-700">ເລືອກປະເພດລາຍຈ່າຍ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Expense Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">ປະເພດລາຍຈ່າຍ:</label>
            <Select value={expenseType} onValueChange={setExpenseType}>
              <SelectTrigger>
                <SelectValue placeholder="ເລືອກປະເພດລາຍຈ່າຍ" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {expenseItems.map((item, index) => (
                  <SelectItem key={index} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-2">ຈຳນວນເງິນ (ກີບ):</label>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="ປ້ອນຈຳນວນເງິນ"
              className="w-full"
            />
            {amount && isNaN(parseFloat(amount)) && (
              <p className="text-red-500 text-sm mt-1">ກະລຸນາປ້ອນຕົວເລກເທົ່ານັ້ນ</p>
            )}
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

          {/* Validation Summary */}
          {expenseType && amount && !isNaN(parseFloat(amount)) && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">ສະຫຼຸບລາຍຈ່າຍ:</h4>
              <p className="text-sm text-red-700">ປະເພດ: {expenseType}</p>
              <p className="text-sm text-red-700">ຈຳນວນ: {parseFloat(amount).toLocaleString()} ກີບ</p>
              {details && <p className="text-sm text-red-700">ລາຍລະອຽດ: {details}</p>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={!expenseType || !amount || isNaN(parseFloat(amount))}
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

export default ExpensePage;

