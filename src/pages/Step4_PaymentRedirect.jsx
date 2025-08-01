import "../styles/Step4_PaymentRedirect.css";
import { useEffect, useState } from "react";

export default function Step4_PaymentRedirect({ setStep }) {
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setWaiting(true);
    // Here you would redirect to ZarrinPal and listen for callback
    // setTimeout is just a mock fallback:
    setTimeout(() => setWaiting(false), 120000); // 2 min
  }, []);

  const handleFallback = () => setStep(5);

  return (
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
  );
}
