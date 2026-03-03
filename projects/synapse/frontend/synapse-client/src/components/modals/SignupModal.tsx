import Logo from '../Logo'
import type { SignupModalProps } from '../../types/modals'
import { useMutation } from '@tanstack/react-query';
import { registerService } from '../../services/authServices';
import { toast } from '../../utils/toast';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

export default function SignupModal({ open = false, onClose = () => {}, onSwitchToLogin = () => {} }: SignupModalProps) {
  // useDispatch
  const dispatch = useDispatch();

  // State Variables
  const [formData , setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // useMutation
    const registerMutation = useMutation({
      mutationFn: registerService,
      onSuccess: (data) => {
        dispatch(setCredentials(data.data));

        toast({
          variant: 'success',
          name: "Registeration Successfull !!!",
          description: "Welcome to Synapse."
        });

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      },
      onError: () => {
        toast({
          variant: 'error',
          name: "Error Registering !!!",
          description: "There's an error registering to Synapse ! Please try again."
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

    const handleRegister = () => {
      registerMutation.mutate(formData);
    };

  if (!open) {
    return null
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full sm:max-w-sm animate-slide-up flex flex-col gap-5
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
          <h2 className="text-[#e2ede9] text-xl font-semibold">Create account</h2>
          <p className="text-[#475569] text-sm">Start your Synapse journey today</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#475569] text-xs uppercase tracking-wider font-medium">
              Full Name
            </label>
            <input
              onChange={(e) => handleInputChange(e)}
              value={formData.name}
              type="text"
              name='name'
              placeholder="Jane Smith"
              className="w-full bg-[#090d0f] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-2.5 outline-none placeholder-[#475569] focus:border-[#10b981] transition-colors"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#475569] text-xs uppercase tracking-wider font-medium">
              Email
            </label>
            <input
              onChange={(e) => handleInputChange(e)}
              value={formData.email}
              type="email"
              name='email'
              placeholder="you@example.com"
              className="w-full bg-[#090d0f] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-2.5 outline-none placeholder-[#475569] focus:border-[#10b981] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#475569] text-xs uppercase tracking-wider font-medium">
              Password
            </label>
            <input
              onChange={(e) => handleInputChange(e)}
              value={formData.password}
              type="password"
              name='password'
              placeholder="••••••••"
              className="w-full bg-[#090d0f] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-2.5 outline-none placeholder-[#475569] focus:border-[#10b981] transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#475569] text-xs uppercase tracking-wider font-medium">
              Confirm Password
            </label>
            <input
              onChange={(e) => handleInputChange(e)}
              value={formData.confirmPassword}
              type="password"
              name='confirmPassword'
              placeholder="••••••••"
              className="w-full bg-[#090d0f] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-2.5 outline-none placeholder-[#475569] focus:border-[#10b981] transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_16px_#10b98144] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)' }}
        >
          Create Account
        </button>

        {/* Switch */}
        <p className="text-center text-[#475569] text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#10b981] hover:text-[#34d399] transition-colors font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
