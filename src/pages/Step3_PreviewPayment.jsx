import "../styles/Step3_PreviewPayment.css";
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';

// Utility: convert all Persian digits to English
function persianToEnglish(s) {
  if (!s) return s;
  return s.replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}

// Utility: convert Jalali string (with Persian or English digits) to Gregorian string
function jalaliToGregorian(dateString) {
  const cleaned = persianToEnglish(dateString.replace(/\//g, "-"));
  const [jy, jm, jd] = cleaned.split('-').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

export default function Step3_PreviewPayment({ form, onNext, onBack }) {
  const [doctorName, setDoctorName] = useState("نامشخص");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    async function fetchDoctors() {
      const { data, error } = await supabase.from('doctors').select('*');
      if (!error && data) setDoctors(data);
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0 && form.doctorId) {
      const doc = doctors.find(d => d.id === form.doctorId);
      if (doc) setDoctorName(`${doc.first_name} ${doc.last_name}${doc.specialty ? " - " + doc.specialty : ""}`);
    }
  }, [doctors, form.doctorId]);


  async function uploadMediaFiles(mediaArray, consultationId) {
    for (const file of mediaArray) {
        console.log("Uploading file:", file, "type:", file?.type, "name:", file?.name, "size:", file?.size);
      const filePath = `consultations/${consultationId}/${file.name || `voice_${Date.now()}.webm`}`;
      const { error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        alert('خطا در آپلود فایل: ' + uploadError.message);
        continue;
      }
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      await supabase.from('media_files').insert([{
        consultation_id: consultationId,
        file_url: publicUrl,
        file_type: file.type,
        file_name: file.name || `voice_${Date.now()}.webm`
      }]);
    }
  }

  async function handlePay() {
    let formattedBirthDate = null;

    if (form.birthDate && typeof form.birthDate.convert === 'function' && typeof form.birthDate.format === 'function') {
      // react-multi-date-picker object
      formattedBirthDate = persianToEnglish(
        form.birthDate.convert('gregorian').format("YYYY-MM-DD")
      );
    } else if (form.birthDate && typeof form.birthDate === 'object' && typeof form.birthDate.toDate === 'function') {
      // native JS Date object
      formattedBirthDate = form.birthDate.toISOString().substring(0, 10);
    } else if (typeof form.birthDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(persianToEnglish(form.birthDate))) {
      // Jalali string in Persian or English digits
      formattedBirthDate = jalaliToGregorian(form.birthDate);
    } else if (typeof form.birthDate === 'string' && form.birthDate.includes('/')) {
      formattedBirthDate = persianToEnglish(form.birthDate.replace(/\//g, "-"));
    } else {
      formattedBirthDate = form.birthDate;
    }

    console.log("Payload for Supabase:", {
      first_name: form.firstName,
      last_name: form.lastName,
      birth_date: formattedBirthDate,
      gender: form.gender,
      national_code: form.nationalCode,
      mobile: form.mobile,
      doctor_id: form.doctorId,
      description: form.description,
      payment_status: 'pending',
      status: 'pending',
    });

    const { data, error } = await supabase.from('consultations').insert([{
      first_name: form.firstName,
      last_name: form.lastName,
      birth_date: formattedBirthDate,
      gender: form.gender,
      national_code: form.nationalCode,
      mobile: form.mobile,
      doctor_id: form.doctorId,
      description: form.description,
      payment_status: 'pending',
      status: 'pending',
    }]).select().single();

    if (error) {
      alert('خطا در ثبت اطلاعات مشاوره: ' + error.message);
      console.error(error);
      return;
    }

    const consultationId = data.id;
    if (form.media && form.media.length > 0) {
      await uploadMediaFiles(form.media, consultationId);
    }
    onNext();
  }

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
        <button className="edit-btn" onClick={onBack}>ویرایش</button>
      </div>
      <div className="fee-info">
        هزینه ویزیت آنلاین غیر همزمان: <b>۳۸۰ هزار تومان</b>
      </div>
      <button className="primary-btn" onClick={handlePay}>پرداخت</button>
    </div>
  );
}
