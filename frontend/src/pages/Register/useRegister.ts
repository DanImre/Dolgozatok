import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { classService, type RegistrationDetailsResponse } from '../../services/classService';
import { useTranslation } from '../../locales/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const useRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, language, setLanguage } = useTranslation();
  const { login, logout } = useAuth();

  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'Valid' | 'Expired' | 'AlreadyRegistered' | 'NotFound'>('Valid');
  const [studentDetails, setStudentDetails] = useState<RegistrationDetailsResponse | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorFallback, setErrorFallback] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('NotFound');
      setLoading(false);
      return;
    }

    const checkToken = async () => {
      setLoading(true);
      try {
        const res = await classService.getRegistrationDetails(token);
        setStatus(res.status);
        setStudentDetails(res);
      } catch (err: any) {
        console.error('Failed to load registration details', err);
        setStatus('NotFound');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasDigit && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCode(null);
    setErrorFallback(null);

    if (!isPasswordValid) {
      if (!hasMinLength) {
        setErrorCode('PASSWORD_MIN_LENGTH');
      } else if (!passwordsMatch) {
        setErrorCode('PASSWORD_MISMATCH');
      } else {
        setErrorFallback(lang.register?.passwordCriteriaTitle || 'Please fulfill all password requirements.');
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await classService.completeRegistration(token, password, confirmPassword);
      setSuccess(true);

      const targetEmail = res?.email || studentDetails?.email;
      if (targetEmail) {
        try {
          // Clear any active session from another account (e.g. teacher)
          logout();
          // Log into the newly registered account immediately
          await login(targetEmail, password, true);
          // Navigate to home/dashboard as the newly registered student
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1200);
          return;
        } catch (loginErr) {
          console.error('Auto-login failed after registration:', loginErr);
        }
      }

      setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err: any) {
      setErrorCode(err.code || null);
      setErrorFallback(err.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  const getTranslatedError = (): string | null => {
    if (!errorCode && !errorFallback) return null;

    const errorMap: Record<string, string | undefined> = {
      TOKEN_REQUIRED: lang.register?.errors?.tokenRequired,
      PASSWORD_REQUIRED: lang.register?.errors?.passwordRequired,
      PASSWORD_MISMATCH: lang.register?.errors?.passwordMismatch,
      PASSWORD_MIN_LENGTH: lang.register?.errors?.passwordMinLength,
      INVALID_LINK: lang.register?.errors?.invalidLink,
      ALREADY_COMPLETED: lang.register?.errors?.alreadyCompleted,
      LINK_EXPIRED: lang.register?.errors?.linkExpired,
      EMAIL_ALREADY_EXISTS: lang.register?.errors?.emailAlreadyExists,
      PasswordRequiresUpper: lang.register?.errors?.passwordRequiresUpper,
      PasswordRequiresLower: lang.register?.errors?.passwordRequiresLower,
      PasswordRequiresDigit: lang.register?.errors?.passwordRequiresDigit,
    };

    if (errorCode && errorMap[errorCode]) {
      return errorMap[errorCode]!;
    }

    if (errorFallback) {
      const lower = errorFallback.toLowerCase();
      if (lower.includes('already been completed') || lower.includes('already completed')) {
        return lang.register?.errors?.alreadyCompleted || errorFallback;
      }
      if (lower.includes('expired')) {
        return lang.register?.errors?.linkExpired || errorFallback;
      }
      if (lower.includes('already exists')) {
        return lang.register?.errors?.emailAlreadyExists || errorFallback;
      }
      if (lower.includes('invalid registration link') || lower.includes('invalid link')) {
        return lang.register?.errors?.invalidLink || errorFallback;
      }
      if (lower.includes('at least 8 characters') || lower.includes('min length')) {
        return lang.register?.errors?.passwordMinLength || errorFallback;
      }
      if (lower.includes('passwords do not match') || lower.includes('mismatch')) {
        return lang.register?.errors?.passwordMismatch || errorFallback;
      }
      if (lower.includes('uppercase')) {
        return lang.register?.errors?.passwordRequiresUpper || errorFallback;
      }
      if (lower.includes('lowercase')) {
        return lang.register?.errors?.passwordRequiresLower || errorFallback;
      }
      if (lower.includes('digit') || lower.includes('number')) {
        return lang.register?.errors?.passwordRequiresDigit || errorFallback;
      }
      return errorFallback;
    }

    return lang.register?.errors?.genericError || 'Registration failed.';
  };

  return {
    token,
    loading,
    status,
    studentDetails,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    hasMinLength,
    hasUpper,
    hasLower,
    hasDigit,
    passwordsMatch,
    isPasswordValid,
    submitting,
    error: getTranslatedError(),
    success,
    handleSubmit,
    lang,
    language,
    toggleLanguage: () => setLanguage(language === 'hu' ? 'en' : 'hu'),
    goToLogin: () => {
      logout();
      navigate('/login');
    }
  };
};
