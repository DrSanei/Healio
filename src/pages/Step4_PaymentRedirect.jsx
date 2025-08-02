import "../styles/Step4_PaymentRedirect.css";
import { useEffect, useState } from "react";
import FixedActionBar from "../components/FixedActionBar";

export default function Step4_PaymentRedirect({ onSuccess = () => {}, onFail = () => {}, onBack = () => {}, onNext = () => {} }) {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    // Simulate payment wait/fallback (replace with real ZarrinPal redirect)
    const timeout = setTimeout(() => setWaiting(false), 120000);
    return () => clearTimeout(timeout);
  }, []);

  const handleFallback = onFail;

  return (
    <>
      <div className="step4-redirect">
        <div className="loader"></div>
        <p>در حال انتقال به صفحه پرداخت...</p>
        {waiting === false && (
          <div className="fallback">
            <p>اگر پرداخت شما انجام نشد یا زمان زیادی منتظر ماندید، لطفاً دوباره تلاش کنید.</p>
            <button className="primary-btn" onClick={handleFallback}>بازگشت</button>
          </div>
        )}
      </div>
      <FixedActionBar onBack={onBack} onNext={onNext} />
    </>
  );
}
