import { useEffect } from "react";
import "../styles/Step5_Success.css";
import FixedActionBar from "../components/FixedActionBar";

export default function Step5_Success({ onHome, form }) {

  useEffect(() => {
    // If you want to trigger anything on mount, do it here
  }, [form]);

  return (
    <>
      <div className="success-page">
        <div className="success-icon">
          <span className="material-icons">check_circle</span>
        </div>
        <div className="success-message">
          <p>پرونده شما جهت مشاوره با موفقیت به پزشک ارسال شد.</p>
          <p>پاسخ مشاوره تا حداکثر ۲۴ ساعت آینده به واتساپ/تلگرام شما ارسال خواهد شد.</p>
          <p>
            برای دریافت پیام‌های مشاوره، لطفا روی لینک زیر کلیک کرده و در تلگرام، بات هیلیو را فعال کنید:<br/>
            <a
              href="https://t.me/Healio_Consult_Bot"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                margin: "18px 0",
                fontWeight: "bold",
                color: "#1976d2",
                fontSize: "1.1em"
              }}
            >
              👉 فعال‌سازی بات مشاوره در تلگرام
            </a>
          </p>
        </div>
        {/* This replaces the home button with the onboarding link */}
        {/* You can keep the home button if you wish: */}
        {/* <button className="primary-btn" onClick={onHome}>بازگشت به صفحه اصلی</button> */}
      </div>
      {/* <FixedActionBar onBack={onBack} onNext={onNext} /> */}
    </>
  );
}
