import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  AlertCircle, 
  X,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    login, 
    register, 
    requestOTP, 
    verifyOTP 
  } = useAuth();

  // Mode: 'otp' | 'login' | 'register'
  const [mode, setMode] = useState(authModalMode || 'otp');

  // OTP sub-step: 1 = Enter Email, 2 = Enter 6-digit Code
  const [otpStep, setOtpStep] = useState(1);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(10);

  // Password fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setErrorMessage('');
      setErrorCode('');
    }
  }, [authModalMode]);

  // Reset states when modal closes or opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage('');
      setErrorCode('');
    } else {
      setOtpStep(1);
      setOtpCode('');
      setIsSubmitting(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Format backend error code to user-friendly copy
  const getFriendlyErrorMessage = (code, rawMessage, details) => {
    if (details && typeof details === 'object') {
      const fieldErrors = Object.entries(details)
        .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
        .join('; ');
      if (fieldErrors) return fieldErrors;
    }

    switch (code) {
      case 'USER_ALREADY_EXISTS':
        return 'An account with this email or username already exists. Try signing in with your password or magic code.';
      case 'INVALID_OTP':
        return 'The 6-digit code is incorrect. Please double check and try again.';
      case 'OTP_EXPIRED':
        return 'Your verification code has expired (valid 10 minutes). Please request a new code.';
      case 'OTP_MAX_ATTEMPTS_EXCEEDED':
        return 'Too many failed verification attempts. Please request a new code.';
      case 'OTP_NOT_FOUND':
        return 'No active verification code found for this email. Please request a code.';
      case 'AUTHENTICATION_FAILED':
        return 'Invalid credentials. Please verify your email/username and password.';
      case 'VALIDATION_ERROR':
        return rawMessage || 'Please verify the entered fields.';
      case 'NETWORK_ERROR':
        return 'Unable to reach the server. Please verify your connection.';
      default:
        return rawMessage || 'Authentication failed. Please try again.';
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setAuthModalMode(newMode);
    setErrorMessage('');
    setErrorCode('');
  };

  // --- Step 1: Request OTP ---
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!otpEmail || !otpEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setErrorCode('VALIDATION_ERROR');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setErrorCode('');

    try {
      const res = await requestOTP(otpEmail.trim());
      setOtpExpiryMinutes(res.expires_in_minutes || 10);
      setOtpStep(2);
    } catch (err) {
      setErrorCode(err.code || 'API_ERROR');
      setErrorMessage(getFriendlyErrorMessage(err.code, err.message, err.details));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMessage('Please enter the 6-digit verification code.');
      setErrorCode('VALIDATION_ERROR');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setErrorCode('');

    try {
      await verifyOTP(otpEmail.trim(), otpCode.trim());
      // Modal closed by context
    } catch (err) {
      setErrorCode(err.code || 'API_ERROR');
      setErrorMessage(getFriendlyErrorMessage(err.code, err.message, err.details));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Password Login ---
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      setErrorMessage('Please enter your email/username and password.');
      setErrorCode('VALIDATION_ERROR');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setErrorCode('');

    try {
      await login(loginIdentifier.trim(), loginPassword);
      // Modal closed by context
    } catch (err) {
      setErrorCode(err.code || 'AUTHENTICATION_FAILED');
      setErrorMessage(getFriendlyErrorMessage(err.code, err.message, err.details));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Register Account ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all registration fields.');
      setErrorCode('VALIDATION_ERROR');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setErrorCode('VALIDATION_ERROR');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setErrorCode('');

    try {
      await register(regUsername.trim(), regEmail.trim(), regPassword);
      // Modal closed by context
    } catch (err) {
      setErrorCode(err.code || 'USER_ALREADY_EXISTS');
      setErrorMessage(getFriendlyErrorMessage(err.code, err.message, err.details));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[32px] overflow-hidden p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.25)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)] text-slate-900 dark:text-white relative animate-scaleUp transition-all"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="relative z-10 space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>WAYPOINT PASSPORT</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {mode === 'otp' ? (otpStep === 1 ? 'Passwordless Sign In' : 'Enter 6-Digit Code') : mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'otp'
              ? 'Sign in or register instantly with a secure 1-time magic code.'
              : mode === 'login'
              ? 'Access your saved trips, custom flight routing, and roadmaps.'
              : 'Join Waypoint to persist itineraries and email trip roadmaps.'}
          </p>
        </div>

        {/* Mode Selector Pills */}
        <div className="relative z-10 flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange('otp')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'otp'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Magic Code</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <span className="font-semibold block">{errorMessage}</span>
              {errorCode && (
                <span className="text-[10px] font-mono text-rose-500/80 dark:text-rose-400/70 mt-0.5 block uppercase">
                  Code: {errorCode}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 1: MAGIC CODE (PASSWORDLESS OTP)                      */}
        {/* ========================================================= */}
        {mode === 'otp' && (
          otpStep === 1 ? (
            /* Step 1: Input Email */
            <form onSubmit={handleRequestOTP} className="relative z-10 space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoFocus
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Magic Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send 6-Digit Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero passwords required • Safe & encrypted</span>
              </div>
            </form>
          ) : (
            /* Step 2: Input 6-Digit Code */
            <form onSubmit={handleVerifyOTP} className="relative z-10 space-y-4">
              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-semibold">Sent to</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300 font-mono">{otpEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(1);
                    setOtpCode('');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    6-Digit Verification Code
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Valid for {otpExpiryMinutes} mins
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  autoFocus
                  className="w-full h-12 text-center text-xl tracking-[0.5em] font-mono font-black rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length < 4}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Authenticate</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleRequestOTP}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Didn't receive code? Resend Code</span>
                </button>
              </div>
            </form>
          )
        )}

        {/* ========================================================= */}
        {/* MODE 2: CLASSICAL SIGN IN (PASSWORD)                      */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <form onSubmit={handlePasswordLogin} className="relative z-10 space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Email or Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="dan@example.com or traveler_dan"
                  autoFocus
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleModeChange('otp')}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot? Use Magic Code
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE 3: CREATE ACCOUNT (REGISTER)                         */}
        {/* ========================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="relative z-10 space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. wanderer_kai"
                  autoFocus
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="kai@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
