import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import '../App.css';

const WelcomePage = ({ onLogin }) => {
  const [loginInput, setLoginInput] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');

  const validCredentials = {
    email: 'somvang.pingsanijai14@gmail.com',
    phone: '02059112974'
  };

  const handleWelcomeClick = () => {
    setShowLogin(true);
  };

  const handleLogin = () => {
    if (loginInput === validCredentials.email || loginInput === validCredentials.phone) {
      onLogin();
    } else {
      setError('ຂໍ້ມູນບໍ່ຖືກຕ້ອງ. ກະລຸນາລອງໃໝ່.');
    }
  };

  if (!showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500 border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              {/* Logo placeholder - ຮູບຜູ້ຍິງສວຍງາມ */}
              <span className="text-4xl">👩‍🍳</span>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              BoyMo Pizza
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button 
              onClick={handleWelcomeClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
            >
              ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ຮ້ານ Mo Pizza
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              ແອັບນີ້ໃຊ້ງານໄດ້ສະເພາະເຈົ້າຂອງຮ້ານ BoyMo Pizza ເທົ່ານັ້ນ.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-500 border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">👩‍🍳</span>
          </div>
          <CardTitle className="text-xl font-bold text-red-600">
            ເຂົ້າສູ່ລະບົບ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="ປ້ອນ Gmail ຫຼື ເບີໂທ"
              value={loginInput}
              onChange={(e) => {
                setLoginInput(e.target.value);
                setError('');
              }}
              className="w-full"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Button 
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            ເຂົ້າສູ່ລະບົບ
          </Button>
          <Button 
            onClick={() => setShowLogin(false)}
            variant="outline"
            className="w-full bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
          >
            ຍ້ອນກັບ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;

