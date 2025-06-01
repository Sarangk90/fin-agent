import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface UserProfile {
  currentAge: number;
  lifeExpectancy: number;
  generalInflation: number;
  educationInflation: number;
  usdToInr: number;
}

interface ProfileSettingsProps {
  userProfile: UserProfile;
  saveUserProfile: (data: UserProfile) => Promise<void>;
  darkMode: boolean;
}

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  darkMode: boolean;
  error?: string;
  step?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  darkMode,
  error,
  step
}) => (
  <div className="mb-4">
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      className={`w-full px-3 py-2 rounded-md border transition-colors
        ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-white' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'}
        ${error ? 'border-red-500' : ''}
        focus:ring-1 focus:ring-blue-500 focus:outline-none
      `}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile, saveUserProfile, darkMode }) => {
  const [profileData, setProfileData] = useState<UserProfile>(userProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProfileData(userProfile);
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    setProfileData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const tempErrors: Record<string, string> = {};
    const fieldsToValidate = ['currentAge', 'lifeExpectancy', 'generalInflation', 'educationInflation', 'usdToInr'];
    
    fieldsToValidate.forEach(field => {
      const val = profileData[field as keyof UserProfile];
      if (val === undefined || isNaN(val)) {
        tempErrors[field] = "Must be a valid number.";
      } else if (val < 0) {
        tempErrors[field] = "Cannot be negative.";
      }
    });

    if (profileData.currentAge >= profileData.lifeExpectancy) {
      tempErrors.lifeExpectancy = "Life expectancy must be greater than current age.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProfile()) {
      await saveUserProfile(profileData);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className="text-3xl font-semibold mb-6">User Profile & Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <InputField
          id="currentAge"
          label="Current Age (Years)"
          type="number"
          value={profileData.currentAge}
          onChange={handleChange}
          darkMode={darkMode}
          required
          error={errors.currentAge}
        />
        <InputField
          id="lifeExpectancy"
          label="Life Expectancy (Years)"
          type="number"
          value={profileData.lifeExpectancy}
          onChange={handleChange}
          darkMode={darkMode}
          required
          error={errors.lifeExpectancy}
        />
        <InputField
          id="generalInflation"
          label="General Inflation Rate (%)"
          type="number"
          step="0.1"
          value={profileData.generalInflation}
          onChange={handleChange}
          darkMode={darkMode}
          required
          error={errors.generalInflation}
        />
        <InputField
          id="educationInflation"
          label="Education Inflation Rate (%)"
          type="number"
          step="0.1"
          value={profileData.educationInflation}
          onChange={handleChange}
          darkMode={darkMode}
          required
          error={errors.educationInflation}
        />
        <InputField
          id="usdToInr"
          label="USD to INR Exchange Rate"
          type="number"
          step="0.01"
          value={profileData.usdToInr}
          onChange={handleChange}
          darkMode={darkMode}
          required
          error={errors.usdToInr}
        />
        
        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle size={16} />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 