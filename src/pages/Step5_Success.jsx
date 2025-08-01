import "../styles/Step5_Success.css";

export default function Step5_Success() {
  const goHome = () => window.location.href = "/";

  return (
    <div className="success-page">
      <div className="success-icon">
        <span className="material-icons">check_circle</span>
      </div>
      <div className="success-message">
        <p>پرونده شما جهت مشاوره با موفقیت به پزشک ارسال شد.</p>
        <p>پاسخ مشاوره تا حداکثر ۲۴ ساعت آینده به واتساپ شما ارسال خواهد شد.</p>
        <p>با سپاس از مشاوره شما با هیلیو.</p>
      </div>
      <button className="primary-btn" onClick={goHome}>بازگشت به صفحه اصلی</button>
    </div>
  );
}
