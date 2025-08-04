import { useEffect } from "react";
import "../styles/Step5_Success.css";
import FixedActionBar from "../components/FixedActionBar";

export default function Step5_Success({ onHome, form }) {
  
  useEffect(() => {
    
    async function sendToDoctor() {
      // 1. Get doctor's WhatsApp number (replace this with real lookup, or hardcode for test)
      let doctorNumber = "+989127619004"; // <--- hardcoded for test
      
      // If you want to fetch from backend by doctorId:
      // doctorNumber = await fetch(`/api/doctor-whatsapp/${form.doctorId}`)
      //   .then(res => res.json())
      //   .then(data => data.whatsapp);

      // 2. Get file URLs (ensure you have URLs, not just file objects)
      const files = form.mediaUrls || [];

      // 3. Send to backend API to trigger WhatsApp
      await fetch("/api/whatsapp/send-to-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorNumber,
          patient: {
            firstName: form.firstName,
            lastName: form.lastName,
            mobile: form.mobile,
            description: form.description,
          },
          files,
        }),
      });
    }

    sendToDoctor();
    // eslint-disable-next-line
  }, [form]);

  return (
    <>
      <div className="success-page">
        <div className="success-icon">
          <span className="material-icons">check_circle</span>
        </div>
        <div className="success-message">
          <p>پرونده شما جهت مشاوره با موفقیت به پزشک ارسال شد.</p>
          <p>پاسخ مشاوره تا حداکثر ۲۴ ساعت آینده به واتساپ شما ارسال خواهد شد.</p>
          <p>با سپاس از مشاوره شما با هیلیو.</p>
        </div>
        <button className="primary-btn" onClick={onHome}>
          بازگشت به صفحه اصلی
        </button>
      </div>
      {/* <FixedActionBar onBack={onBack} onNext={onNext} /> */}
    </>
  );
}
