import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Phone, Mail, MapPin, ExternalLink, Facebook, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';

interface ContactSectionProps {
  isActive: boolean;
}

/**
 * Contact section component with 2x2 grid layout
 * Maintains the exact same visual style as the original
 */
export const ContactSection: React.FC<ContactSectionProps> = ({ isActive }) => {
  const { t } = useTranslation();
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'verification_sent'>('idle');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle initial form submission (sends verification email)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/contact/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No CSRF token needed
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('verification_sent');
        setIsVerifying(true);
      } else {
        setFormStatus('error');
      }

      // Reset error status after 3 seconds
      if (result.success === false) {
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  // Handle email verification
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/contact/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No CSRF token needed
        },
        body: JSON.stringify({
          email: formData.email,
          verification_code: verificationCode
        })
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
        setVerificationCode('');
        setIsVerifying(false);
        setShowContactForm(false);
      } else {
        setFormStatus('error');
      }

      // Reset status after 3 seconds
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error('Verification error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const sectionClasses = `fixed inset-0 pt-20 bg-white dark:bg-[#0a0a0a] transition-all duration-700 ease-in-out overflow-y-auto ${
    isActive 
      ? 'opacity-100 translate-y-0 z-10' 
      : 'opacity-0 translate-y-full z-0'
  }`;

  // Phone numbers data
  const phoneItems = [
    {
      label: 'Primary Phone',
      value: '+964 751 446 39 59',
      href: 'https://api.whatsapp.com/send?phone=9647514463959',
      icon: <Phone className="w-4 h-4 text-white" />,
      description: t('welcome.contact.primary')
    },
    {
      label: 'Secondary Phone',
      value: '+964 751 447 39 59',
      href: 'https://api.whatsapp.com/send?phone=9647514473959',
      icon: <Phone className="w-4 h-4 text-white" />,
      description: t('welcome.contact.secondary')
    }
  ];

  // Email data - dynamically get from environment
  const page = usePage();
  const getBusinessEmail = () => {
    try {
      const props = page.props as { app?: { mail_from_address?: string } };
      return props.app?.mail_from_address || 'info@hajiprinting.com';
    } catch {
      return (window as { __INERTIA_APP_DATA__?: { app?: { mail_from_address?: string } } }).__INERTIA_APP_DATA__?.app?.mail_from_address || 'info@hajiprinting.com';
    }
  };

  const emailItems = [
    {
      label: 'Business Email',
      value: getBusinessEmail(),
      icon: <Mail className="w-4 h-4 text-white" />,
      description: t('welcome.contact.businessEmail')
    }
  ];

  // Location data
  const locationItems = [
    {
      label: 'Business Location',
      value: 'Erbil-Ehsa Street, Near Sarhad Stationery',
      href: 'https://maps.app.goo.gl/3hLgsgbYeD5e37d59?g_st=ipc',
      icon: <ExternalLink className="w-4 h-4 text-white" />,
      description: 'Erbil, Kurdistan Region, Iraq'
    }
  ];

  // Social media data
  const socialItems = [
    {
      label: 'Facebook',
      value: 'Haji Printing',
      href: 'https://facebook.com/hajiprinting',
      icon: <Facebook className="w-4 h-4 text-white" />,
      description: 'Follow us on Facebook'
    }
  ];

  return (
    <section className={sectionClasses}>
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Scroll Indicator */}
        <div className="fixed top-24 right-4 z-20 hidden sm:block">
          <div className="bg-white dark:bg-[#1c1917] rounded-full p-2 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="w-2 h-8 bg-gradient-to-b from-[#F58E18] to-[#EA580C] rounded-full opacity-60"></div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {/* Contact Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('welcome.contact.title')}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('welcome.contact.subtitle')}
              </p>
            </div>

            {/* Contact Grid - 2x2 Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Top Left - Phone Numbers */}
              <div className="bg-white dark:bg-[#1c1917] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('welcome.contact.phoneNumbers')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('welcome.contact.whatsappHint')}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {phoneItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white/50 dark:bg-[#431407]/50 rounded-lg hover:bg-white/70 dark:hover:bg-[#431407]/70 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Top Right - Contact Form Section */}
              <div className="bg-white dark:bg-[#1c1917] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('welcome.contact.form.title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('welcome.contact.form.subtitle')}
                    </p>
                  </div>
                </div>

                {!showContactForm ? (
                  <div className="space-y-4">

                    {emailItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-white/50 dark:bg-[#431407]/50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.value}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full mt-4 px-4 py-2.5 bg-[#F58E18] text-white rounded-lg font-medium hover:bg-[#EA580C] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {t('welcome.contact.form.sendMessage')}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Email Verification Warning */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        ⚠️ Please use your real email address. We'll send a verification code before processing your message.
                      </p>
                    </div>

                    {!isVerifying ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            name="name"
                            placeholder="Your Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Your Phone Number (Required)"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            name="email"
                            placeholder="Your REAL Email (for verification)"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-colors"
                          />
                        </div>
                        <div>
                          <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 bg-white/50 dark:bg-[#431407]/50 border border-gray-200 dark:border-[#431407] rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-colors resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={formStatus === 'sending'}
                            className="flex-1 px-4 py-2.5 bg-[#F58E18] text-white rounded-lg font-medium hover:bg-[#EA580C] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {formStatus === 'sending' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send Verification
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            className="px-4 py-2.5 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerification} className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                            📧 Verification code sent to: <strong>{formData.email}</strong>
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Check your inbox and enter the 6-digit code below
                          </p>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Enter 6-digit verification code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            maxLength={6}
                            className="w-full px-3 py-2 bg-white/50 dark:bg-[#431407]/50 border border-gray-200 dark:border-[#431407] rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-colors text-center text-lg tracking-widest"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={formStatus === 'sending' || verificationCode.length !== 6}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {formStatus === 'sending' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Verify & Send
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsVerifying(false);
                              setVerificationCode('');
                              setFormStatus('idle');
                            }}
                            className="px-4 py-2.5 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 cursor-pointer"
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Status Messages */}
                    {formStatus === 'verification_sent' && (
                      <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Verification code sent! Check your email.
                        </p>
                      </div>
                    )}

                    {formStatus === 'success' && (
                      <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Message sent successfully! We'll contact you soon.
                        </p>
                      </div>
                    )}

                    {formStatus === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Something went wrong. Please try again.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bottom Left - Location Section */}
              <div className="bg-white dark:bg-[#1c1917] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('welcome.contact.ourLocation')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('welcome.contact.visitOffice')}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {locationItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white/50 dark:bg-[#431407]/50 rounded-lg hover:bg-white/70 dark:hover:bg-[#431407]/70 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom Right - Social Media */}
              <div className="bg-white dark:bg-[#1c1917] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('welcome.contact.socialMedia')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('welcome.contact.socialHint')}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {socialItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white/50 dark:bg-[#431407]/50 rounded-lg hover:bg-white/70 dark:hover:bg-[#431407]/70 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Spacing for Mobile */}
        <div className="h-8 sm:h-12 md:h-16"></div>
      </div>
    </section>
  );
};
