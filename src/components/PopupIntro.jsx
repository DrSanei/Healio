import '../styles/PopupIntro.css';

export default function PopupIntro({ onClose }) {
  return (
    <div className="popup-intro-backdrop">
      <div className="popup-intro">
        <h2>مشاوره پزشکی غیر همزمان با پزشک</h2>
        <p>
          در مشاوره غیر همزمان، شما اطلاعات بیماری خود را به صورت متنی، صوتی یا تصویری به همراه آزمایشات و رادیوگرافی (در صورت وجود) به پزشک ارسال می‌کنید.<br />
          پزشک شما تا حدود ۲۴ ساعت بعد پاسخ خود را به واتساپ شما ارسال خواهد کرد.<br />
          <b>لطفاً در صورت مشکل اورژانسی به بیمارستان مراجعه یا با ۱۱۵ تماس بگیرید.</b>
        </p>
        <button className="primary" onClick={onClose}>متوجه شدم</button>
      </div>
    </div>
  );
}
