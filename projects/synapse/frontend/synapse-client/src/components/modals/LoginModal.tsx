import Logo from '../Logo'
import type { LoginModalProps } from '../../types/modals'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { loginService } from '../../services/authServices';
import { toast } from '../../utils/toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

export default function LoginModal({ open = false, onClose = () => {}, onSwitchToSignup = () => {} }: LoginModalProps) {
  // useDispatch
  const dispatch = useDispatch();

  // State Variables
  const [formData , setFormData] = useState({
    email: "",
    password: ""
  });

  // useMutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));

      toast({
        variant: 'success',
        name: "Logged In Successfully !!!",
        description: "Welcome to Synapse."
      });

      setFormData({
        email: "",
        password: "",
      });
    },
    onError: () => {
      toast({
        variant: 'error',
        name: "Error Logging In !!!",
        description: "There's an error logging in to Synapse ! Please try again."
      });
    }
  });

  // Handler Functions
  const handleInputChange = (e) => {
    const { name , value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = () => {
    loginMutation.mutate(formData);
  };
  
  if (!open){
    return null
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full sm:max-w-sm animate-slide-up flex flex-col gap-6
          rounded-t-2xl sm:rounded-2xl border border-[#1a2228]
          p-6 sm:p-8
          max-h-[92dvh] sm:max-h-none overflow-y-auto"
        style={{ background: '#0f1519' }}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden mx-auto w-10 h-1 rounded-full bg-[#1a2228] -mt-1 mb-1" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#475569] hover:text-[#e2ede9] transition-colors text-xl leading-none"
        >
          ×
        </button>

        {/* Brand */}
        <div className="flex justify-center">
          <Logo size="sm" />
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[#e2ede9] text-xl font-semibold">Welcome back</h2>
          <p className="text-[#475569] text-sm">Sign in to your Synapse account</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#475569] text-xs uppercase tracking-wider font-medium">
              Email
            </label>
            <input
              onChange={(e) => handleInputChange(e)}
              value={formData.email}
              name='email'
              type="email"
              placeholder="you@example.com"
              className="w-full bg-[#090d0f] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-2.5 outline-none placeholder-[#475569] focus:border-[#10b981] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[#475569] text-xs uppercase tracking-wider font-medium">
                Password
              </label>
              <button className="text-[#10b981] text-xs hover:text-[#34d399] transition-colors">
                Forgot password?
              </button>
            </div>
            <input
              onChange={(e) => handleInputChange(e)}
              value={formData.password}
              name='password'
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#090d0f] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-2.5 outline-none placeholder-[#475569] focus:border-[#10b981] transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_16px_#10b98144] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)' }}
        >
          Sign In
        </button>

        {/* Switch */}
        <p className="text-center text-[#475569] text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-[#10b981] hover:text-[#34d399] transition-colors font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
