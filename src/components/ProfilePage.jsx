import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ArrowLeft, Camera, Save, Settings, Store, Globe, MessageSquare } from 'lucide-react';
import '../App.css';

const ProfilePage = ({ onBack }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('ບອຍ');
  const [storeStatus, setStoreStatus] = useState('ເປີດ');
  const [selectedLanguage, setSelectedLanguage] = useState('lo');
  const [isEditing, setIsEditing] = useState(false);

  const languages = [
    { code: 'lo', name: 'ລາວ', flag: '🇱🇦' },
    { code: 'th', name: 'ໄທ', flag: '🇹🇭' },
    { code: 'zh', name: 'ຈີນ', flag: '🇨🇳' },
    { code: 'en', name: 'ອັງກິດ', flag: '🇺🇸' },
    { code: 'vi', name: 'ຫວຽດນາມ', flag: '🇻🇳' }
  ];

  const storeStatuses = [
    { value: 'ເປີດ', color: 'bg-green-500', label: 'ເປີດ' },
    { value: 'ປິດ', color: 'bg-red-500', label: 'ປິດ' },
    { value: 'ປັບປຸງ', color: 'bg-yellow-500', label: 'ປັບປຸງ' },
    { value: 'ພັກວັນບຸນ', color: 'bg-blue-500', label: 'ພັກວັນບຸນ' }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save logic here
    alert('ບັນທຶກການປ່ຽນແປງສຳເລັດ!');
    setIsEditing(false);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage);
  };

  const getCurrentStatus = () => {
    return storeStatuses.find(status => status.value === storeStatus);
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
        <h1 className="text-xl font-bold text-white">ການຈັດການໂປຣໄຟລ໌</h1>
        <div className="w-20"></div>
      </div>

      {/* Profile Image */}
      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700 flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            ຮູບໂປຣໄຟລ໌
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">👩‍🍳</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <Button
              onClick={() => document.getElementById('profile-upload').click()}
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">ກົດເພື່ອປ່ຽນຮູບໂປຣໄຟລ໌</p>
        </CardContent>
      </Card>

      {/* Nickname */}
      <Card className="border-blue-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-blue-700">ຊື່ຫຼິ້ນ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ປ້ອນຊື່ຫຼິ້ນ"
              disabled={!isEditing}
              className="flex-1"
            />
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Store Status */}
      <Card className="border-orange-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-orange-700 flex items-center">
            <Store className="h-5 w-5 mr-2" />
            ສະຖານະຮ້ານ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">ສະຖານະປັດຈຸບັນ:</span>
              <Badge className={`${getCurrentStatus()?.color} text-white`}>
                {storeStatus}
              </Badge>
            </div>
            <Select value={storeStatus} onValueChange={setStoreStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {storeStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card className="border-green-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            ເລືອກພາສາ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">ພາສາປັດຈຸບັນ:</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCurrentLanguage()?.flag}</span>
                <span>{getCurrentLanguage()?.name}</span>
              </div>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="border-indigo-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-indigo-700 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Feedback ຈາກລູກຄ້າ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">ຍັງບໍ່ມີ Feedback ຈາກລູກຄ້າ</p>
            <p className="text-sm text-gray-500 mt-2">
              ຟີເຈີນີ້ຈະຖືກເພີ່ມໃນອະນາຄົດ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Developer Contact */}
      <Card className="border-gray-500 border-2 mb-20">
        <CardHeader>
          <CardTitle className="text-gray-700">ຂໍ້ມູນຜູ້ພັດທະນາ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <p><strong>ຊື່:</strong> ທ້າວ ສົມຫວັງ ປິງສະນີໃຈ</p>
            <p><strong>ຊື່ຫຼິ້ນ:</strong> ບອຍ</p>
            <p><strong>ເບີໂທ/WhatsApp:</strong> 02054539859</p>
            <p><strong>Gmail:</strong> somvang.pingsanijai14@gmail.com</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && (
        <div className="fixed bottom-20 left-4 right-4">
          <Button
            onClick={handleSave}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
          >
            <Save className="h-4 w-4 mr-2" />
            ບັນທຶກການປ່ຽນແປງ
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

