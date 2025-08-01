import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from '../firebase/firestore';
import { getTranslation } from '../utils/translations.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import '../App.css';

const ProfilePage = ({ onBack }) => {
  const { language, changeLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [storeStatus, setStoreStatus] = useState("open");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setNickname(userData.nickname || "");
          setProfileImageUrl(userData.profileImageUrl || "");
          setStoreStatus(userData.storeStatus || "open");
          setFeedback(userData.feedback || "");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      setIsLoading(true);
      try {
        const storageRef = ref(storage, profile_images/${user.uid});
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setProfileImageUrl(url);
        setMessage(getTranslation(language, "save_success"));
      } catch (error) {
        setMessage(getTranslation(language, "save_error") + error.message);
      } finally {
        setIsLoading(false);
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const profileData = {
        nickname,
        profileImageUrl,
        storeStatus,
        feedback,
      };
      const result = await updateProfile(user.uid, profileData);
      if (result.success) {
        setMessage(getTranslation(language, "save_success"));
      } else {
        setMessage(getTranslation(language, "save_error") + result.error);
      }
    } catch (error) {
      setMessage(getTranslation(language, "save_error") + error.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 p-4">
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
        <h1 className="text-xl font-bold text-white">{getTranslation(language, "profile_management")}</h1>
        <div className="w-20"></div>
      </div>

      {/* Profile Management Form */}
      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "profile_image")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4 border-2 border-purple-500">
            <AvatarImage src={profileImageUrl} alt="Profile" />
            <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : "UN"}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profile-image-upload"
          />
          <Button
            onClick={() => document.getElementById("profile-image-upload").click()}
            variant="outline"
            className="bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
          >
            <Camera className="h-4 w-4 mr-2" />
            {getTranslation(language, "click_to_change_image")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "nickname")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={getTranslation(language, "enter_nickname")}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "current_status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={storeStatus} onValueChange={setStoreStatus}>
            <SelectTrigger>
              <SelectValue placeholder={getTranslation(language, "store_status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">{getTranslation(language, "open")}</SelectItem>
              <SelectItem value="closed">{getTranslation(language, "closed")}</SelectItem>
              <SelectItem value="renovating">{getTranslation(language, "renovating")}</SelectItem>
              <SelectItem value="holiday">{getTranslation(language, "holiday")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "select_language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger>
              <SelectValue placeholder={getTranslation(language, "select_language")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lo">ລາວ</SelectItem>
              <SelectItem value="th">ไทย</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">{getTranslation(language, "current_language")}: {language}</p>
        </CardContent>
      </Card>

      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "feedback_from_customers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={getTranslation(language, "no_feedback_yet")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="3"
            disabled
          />
          <p className="text-sm text-gray-500 mt-2">{getTranslation(language, "feature_coming_soon")}</p>
        </CardContent>
      </Card>

      <Card className="border-purple-500 border-2 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-700">{getTranslation(language, "developer_info")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-700"><strong>{getTranslation(language, "name")}:</strong> {getTranslation(language, "developer_name")}</p>
          <p className="text-gray-700"><strong>{getTranslation(language, "phone_whatsapp")}:</strong> {getTranslation(language, "developer_phone")}</p>
          <p className="text-gray-700"><strong>{getTranslation(language, "gmail")}:</strong> {getTranslation(language, "developer_gmail")}</p>
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
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
        >
          {isLoading ? getTranslation(language, "saving") : getTranslation(language, "save_changes")}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
