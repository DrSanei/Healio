import "../styles/Step3_PreviewPayment.css";
import FixedActionBar from "../components/FixedActionBar";


export default function Step3_PreviewPayment({ form, onNext, onBack }) {
  const handleEdit = onBack;
  const handlePay = onNext;

  let doctorName = "";
  if (form.doctorId === "1") doctorName = "دکتر احمدی - داخلی";
  else if (form.doctorId === "2") doctorName = "دکتر فاطمی - پوست";
  else doctorName = "نامشخص";

  return (
    <div className="step3-preview">
      <div className="summary-card">
        <h3>پیش‌نمایش اطلاعات</h3>
        <ul>
          <li>نام: {form.firstName || ""} {form.lastName || ""}</li>
            <li>تاریخ تولد: {form.birthDate && form.birthDate.format ? form.birthDate.format() : form.birthDate || ""}</li>
          <li>جنسیت: {form.gender === 'male' ? 'مرد' : form.gender === 'female' ? 'زن' : ""}</li>
          <li>کد ملی: {form.nationalCode || ""}</li>
          <li>شماره همراه: {form.mobile || ""}</li>
          <li>پزشک: {doctorName}</li>
        </ul>
       <p>
        شرح بیماری:{" "}
        {form.description
            ? form.description.length > 20
            ? form.description.substring(0, 20) + " ..."
            : form.description
            : ""}
        </p>
        <div>
          <b>فایل‌های ضمیمه:</b>
          <div className="media-thumbs">
            {form.media && form.media.length > 0 ? form.media.map((file, idx) => (
              <span key={idx} className="thumb-preview">{file.name}</span>
            )) : <span>بدون فایل</span>}
          </div>
        </div>
        <button className="edit-btn" onClick={handleEdit}>ویرایش</button>
      </div>
      <div className="fee-info">
        هزینه ویزیت آنلاین غیر همزمان: <b>۳۸۰ هزار تومان</b>
      </div>
      <button className="primary-btn" onClick={handlePay}>پرداخت</button>
    </div>
    
  );
}
