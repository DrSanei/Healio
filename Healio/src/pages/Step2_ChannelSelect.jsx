// src/Step2_ChannelSelect.jsx
import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Step2_ChannelSelect.css";


// If you already have a Progress component, import it here instead.
// import Progress from "./components/Progress";

const TELEGRAM_URL = import.meta.env.VITE_HEALIO_TELEGRAM_URL || "https://t.me/HealioBot";

export default function Step2_ChannelSelect() {
  const navigate = useNavigate();

  // Fallback progress bar (use only if you don't already have a shared one)
  const FallbackProgress = useMemo(() => (
    <div dir="rtl" className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center justify-between text-sm mb-2">
        <span>مرحله ۲ از ۲</span>
        <span>انتخاب روش ارسال</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-pink-500" style={{ width: "66%" }} />
      </div>
    </div>
  ), []);

  const handleWhatsApp = () => {
    window.alert("این امکان در حال راه اندازی است. لطفا مشاوره از طریق تلگرام را انتخاب بفرمایید.");
  };

  const handleTelegram = () => {
    window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
  };

  const handleHealio = () => {
    // Navigate to your EXISTING (old) Step 2 page
    navigate("/step2-old");
  };

  const handleBack = () => {
    navigate("/step1");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900">
      {/* If you have a layout/header, keep it here */}
      {/* Replace FallbackProgress with your shared <Progress current={2} total={2} /> if you have one */}
      {FallbackProgress}

      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          لطفا برای ارسال مشاوره یکی از گزینه های زیر را انتخاب فرمایید
        </h1>

        <div className="space-y-3 mt-6">
          {/* Telegram */}
          <button
            type="button"
            onClick={handleTelegram}
            className="w-full inline-flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-semibold text-white"
            style={{ backgroundColor: "#229ED9" }}
            aria-label="ارسال مشاوره از طریق تلگرام (پیشنهادی)"
          >
            <TelegramIcon />
            <span>ارسال مشاوره از طریق تلگرام (پیشنهادی)</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full inline-flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
            aria-label="ارسال مشاوره از طریق واتساپ"
          >
            <WhatsAppIcon />
            <span>ارسال مشاوره از طریق واتساپ</span>
          </button>

          {/* Healio App */}
          <button
            type="button"
            onClick={handleHealio}
            className="w-full inline-flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-semibold text-white"
            style={{ backgroundColor: "#E91E63" }} // Healio pink theme
            aria-label="مشاوره از طریق اپلیکیشن هیلیو"
          >
            <HealioIcon />
            <span>مشاوره از طریق اپلیکیشن هیلیو</span>
          </button>
        </div>

        {/* Back */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <span className="material-icons" style={{ fontSize: 20 }}>arrow_back</span>
            بازگشت
          </button>

          {/* Optional: link to support or FAQ */}
          {/* <Link to="/help" className="text-sm text-pink-600 hover:text-pink-700">نیاز به راهنمایی دارید؟</Link> */}
        </div>
      </div>
    </div>
  );
}

// Simple inline SVGs so you don't rely on external assets
function TelegramIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 240 240" fill="none" {...props} aria-hidden="true">
      <circle cx="120" cy="120" r="120" fill="white" opacity="0.15" />
      <path fill="currentColor" d="M...Z" />
      {/* Minimal mark; you can replace with your preferred SVG.
         For brand color, we color the button background instead. */}
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" {...props} aria-hidden="true">
      <path fill="currentColor" d="M...Z" />
    </svg>
  );
}

function HealioIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20..." fill="currentColor" />
    </svg>
  );
}
