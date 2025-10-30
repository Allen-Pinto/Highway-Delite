import { User, Mail, Phone } from 'lucide-react';

interface CheckoutFormProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

export default function CheckoutForm({
  customerName,
  customerEmail,
  customerPhone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}: CheckoutFormProps) {
  return (
    <div className="space-y-5">
      {/* Full Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="name"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your full name"
            required
            className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            id="email"
            value={customerEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Booking confirmation will be sent to this email
        </p>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            id="phone"
            value={customerPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="10-digit mobile number"
            required
            pattern="[0-9]{10}"
            maxLength={10}
            className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}