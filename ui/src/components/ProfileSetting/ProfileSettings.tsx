import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Calendar, Percent, DollarSign, BookOpen, Edit2, X, Check } from 'lucide-react';
import styles from './ProfileSettings.module.scss';

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

const defaultProfile: UserProfile = {
  currentAge: 30,
  lifeExpectancy: 80,
  generalInflation: 6,
  educationInflation: 10,
  usdToInr: 0 // This will be updated by the parent component
};

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile, saveUserProfile, darkMode }) => {
  const [profileData, setProfileData] = useState<UserProfile>({
    ...defaultProfile,
    ...userProfile, // Override defaults with any provided userProfile values
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setProfileData(userProfile);
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove any non-numeric characters except decimal point
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    setProfileData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Format value for display (handles undefined and adds % for inflation fields)
  const formatDisplayValue = (name: string, value: number | undefined): string => {
    if (value === undefined || value === null) return '';
    if (name.includes('Inflation')) {
      return value.toString();
    }
    return value.toString();
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
      setIsSaving(true);
      try {
        await saveUserProfile(profileData);
        setSaveSuccess(true);
        setIsEditing(false);
        // Hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setProfileData(userProfile);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className={`${styles.profileContainer} ${darkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Profile Settings</h2>
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              className={styles.editButton}
              type="button"
            >
              <Edit2 size={16} className={styles.buttonIcon} />
              <span>Edit</span>
            </button>
          ) : (
            <div className={styles.buttonGroup}>
              <button 
                onClick={handleCancel}
                className={`${styles.button} ${styles.cancelButton}`}
                type="button"
                disabled={isSaving}
              >
                <X size={16} className={styles.buttonIcon} />
                <span>Cancel</span>
              </button>
              <button 
                type="submit" 
                form="profileForm"
                className={`${styles.button} ${styles.saveButton}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check size={16} className={styles.buttonIcon} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <p>Manage your personal and financial preferences</p>
        {saveSuccess && (
          <div className={styles.successMessage}>
            <CheckCircle size={18} />
            <span>Profile updated successfully!</span>
          </div>
        )}
      </div>
      
      <form id="profileForm" onSubmit={handleSubmit} className={`${styles.form} ${!isEditing ? styles.viewMode : ''}`}>
        <div className={styles.formGrid}>
          <div className={styles.inputField}>
            <label htmlFor="currentAge">
              Current Age <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={18} />
              <input
                type="number"
                id="currentAge"
                name="currentAge"
                value={profileData.currentAge}
                onChange={handleChange}
                min="18"
                max="120"
                required
                className={`${errors.currentAge ? styles.errorInput : ''} ${!isEditing ? styles.disabledInput : ''}`}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
            {errors.currentAge && <span className={styles.error}>{errors.currentAge}</span>}
          </div>
          
          <div className={styles.inputField}>
            <label htmlFor="lifeExpectancy">
              Life Expectancy <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <Calendar className={styles.inputIcon} size={18} />
              <input
                type="number"
                id="lifeExpectancy"
                name="lifeExpectancy"
                value={profileData.lifeExpectancy}
                onChange={handleChange}
                min={profileData.currentAge + 1}
                max="120"
                required
                className={errors.lifeExpectancy ? styles.errorInput : ''}
              />
            </div>
            {errors.lifeExpectancy && <span className={styles.error}>{errors.lifeExpectancy}</span>}
          </div>
          
          <div className={styles.inputField}>
            <label htmlFor="generalInflation">
              General Inflation <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <Percent className={styles.inputIcon} size={18} />
              <input
                type="number"
                id="generalInflation"
                name="generalInflation"
                value={formatDisplayValue('generalInflation', profileData.generalInflation)}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="50"
                required
                className={errors.generalInflation ? styles.errorInput : ''}
              />
            </div>
            {errors.generalInflation && <span className={styles.error}>{errors.generalInflation}</span>}
          </div>
          
          <div className={styles.inputField}>
            <label htmlFor="educationInflation">
              Education Inflation <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <BookOpen className={styles.inputIcon} size={18} />
              <input
                type="number"
                id="educationInflation"
                name="educationInflation"
                value={formatDisplayValue('educationInflation', profileData.educationInflation)}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="50"
                required
                className={errors.educationInflation ? styles.errorInput : ''}
              />
            </div>
            {errors.educationInflation && <span className={styles.error}>{errors.educationInflation}</span>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 