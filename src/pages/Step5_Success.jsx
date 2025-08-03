import "../styles/Step5_Success.css";
import FixedActionBar from "../components/FixedActionBar";


export default function Step5_Success({ onHome }) {
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
      <button className="primary-btn" onClick={onHome}>بازگشت به صفحه اصلی</button>
    </div>
    {/*<FixedActionBar onBack={onBack} onNext={onNext} />*/}
        </>
  );
}
