"use client";

import { useState } from "react";
import { Check, Star, Building2, User, Zap, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<"B2C" | "B2B">("B2C");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = (planName: string) => {
    setLoadingPlan(planName);
    // Simulate HTTP delay to local backend payment controller
    setTimeout(() => {
      setLoadingPlan(null);
      toast.success(`Redirecting to Chapa/Telebirr for ${planName}...`, {
        icon: '💵',
        duration: 4000
      });
    }, 1500);
  };

  const studentPlans = [
    {
      id: "free",
      name: "Freemium",
      price: "0",
      duration: "/ forever",
      description: "Basic access to get you started.",
      features: [
        "Access to Public Community",
        "Read-only Q&A Board",
        "3 AI Tutor Queries per day",
        "Standard Study Planner"
      ],
      buttonText: "Current Plan",
      highlight: false,
    },
    {
      id: "1mo",
      name: "1 Month Boost",
      price: "200",
      duration: "ETB / mo",
      description: "Perfect for short-term exam prep.",
      features: [
        "Unlimited AI Voice Tutor",
        "Priority Q&A Responses",
        "File Attachments in Community",
        "Smart Task Adjustments",
        "Zero Ads"
      ],
      buttonText: "Subscribe via Chapa",
      highlight: false,
    },
    {
      id: "3mo",
      name: "3 Month Mastery",
      price: "500",
      duration: "ETB / 3mo",
      description: "Our most popular student tier.",
      badge: "Most Popular - 15% Off",
      features: [
        "Everything in 1 Month Boost",
        "+ Early Access to New Features",
        "+ 1 Teacher-Verified Answer/week",
        "+ AI Discussion Summaries"
      ],
      buttonText: "Subscribe via Telebirr",
      highlight: true,
    },
    {
      id: "1yr",
      name: "Annual Scholar",
      price: "1,500",
      duration: "ETB / yr",
      description: "Commit to your academic success.",
      badge: "Save 35%",
      features: [
        "All Premium Features Unlocked",
        "Unlimited Teacher-Verified Requests",
        "Exclusive Scholar Badge",
        "Downloadable Offline Material"
      ],
      buttonText: "Get Annual Pass",
      highlight: false,
    }
  ];

  const schoolPlans = [
    {
      id: "b2b-basic",
      name: "School Basic",
      price: "5,000",
      duration: "ETB / mo",
      description: "Up to 500 Students.",
      features: [
        "Core LMS Integration",
        "Base Community Platform",
        "Basic Analytics Dashboard"
      ],
      buttonText: "Start Free Trial"
    },
    {
      id: "b2b-standard",
      name: "School Standard",
      price: "12,000",
      duration: "ETB / mo",
      description: "Up to 1,500 Students + Tooling.",
      features: [
        "Teacher Monitoring Dashboard",
        "Detailed Engagement Analytics",
        "Bulk Student Onboarding",
        "Priority Support Ticket Line"
      ],
      buttonText: "Contact Sales",
      highlight: true,
    },
    {
      id: "b2b-premium",
      name: "District Premium",
      price: "Custom",
      duration: "",
      description: "Unlimited scaling for entire blocks.",
      features: [
        "White-labeled UI Elements",
        "Offline Data Syncing Support",
        "Direct Gradebook API Integration",
        "Dedicated Account Manager"
      ],
      buttonText: "Talk to Partnership Team"
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-teal-300 to-blue-400 bg-clip-text text-transparent pb-2">
          Invest in Your Brilliance
        </h1>
        <p className="text-white/60 text-lg">
          Whether you're studying for the National Exam or deploying learning at scale, we have a plan built for the Ethiopian ecosystem.
        </p>

        {/* Custom Toggle Switch */}
        <div className="flex items-center justify-center pt-6">
          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl inline-flex relative">
            <button
              onClick={() => setActiveTab("B2C")}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-colors ${
                activeTab === "B2C" ? "text-slate-900" : "text-white hover:text-white/80"
              }`}
            >
              <User className="w-4 h-4" /> Individual
            </button>
            <button
              onClick={() => setActiveTab("B2B")}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-colors ${
                activeTab === "B2B" ? "text-slate-900" : "text-white hover:text-white/80"
              }`}
            >
              <Building2 className="w-4 h-4" /> For Schools
            </button>
            {/* Sliding Background */}
            <motion.div
              layoutId="pricingTab"
              className="absolute inset-y-1 bg-gradient-to-r from-amber-400 to-teal-400 rounded-xl shadow-lg"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                width: "calc(50% - 4px)",
                left: activeTab === "B2C" ? "4px" : "calc(50%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-1 md:grid-cols-2 ${activeTab === 'B2C' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 max-w-7xl mx-auto pt-8`}
        >
          {(activeTab === "B2C" ? studentPlans : schoolPlans).map((plan, i) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-teal-900/40 to-slate-900 border-teal-500/50 shadow-[0_0_40px_-15px_rgba(20,184,166,0.3)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50 h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/40 font-medium">{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-teal-400' : 'text-amber-400'}`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name)}
                disabled={loadingPlan === plan.name || plan.id === 'free'}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 ${
                  plan.id === 'free' 
                    ? "bg-white/10 text-white/50 cursor-not-allowed"
                    : plan.highlight
                      ? "bg-teal-400 hover:bg-teal-300 text-slate-900 shadow-teal-500/25"
                      : "bg-white text-slate-900 hover:bg-slate-200"
                }`}
              >
                {loadingPlan === plan.name ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {plan.buttonText}
                    {plan.id !== 'free' && <ArrowRight className="w-4 h-4 ml-1" />}
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
            <Zap className="w-8 h-8" />
          </div>
          <h4 className="text-white font-bold">Instant Activation</h4>
          <p className="text-sm text-white/50">Your premium features unlock the second your payment clears via Telebirr or Chapa.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h4 className="text-white font-bold">Secure Local Payments</h4>
          <p className="text-sm text-white/50">Fully integrated with CBE, Telebirr, and Awash Bank via certified API partners.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
            <Star className="w-8 h-8" />
          </div>
          <h4 className="text-white font-bold">Cancel Anytime</h4>
          <p className="text-sm text-white/50">No hidden fees or strings attached. Downgrade to freemium whenever you need.</p>
        </div>
      </div>
    </div>
  );
}
