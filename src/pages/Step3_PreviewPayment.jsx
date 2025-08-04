import "../styles/Step3_PreviewPayment.css";
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';

function persianToEnglish(s) {
  if (!s) return s;
  return s.replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}

function jalaliToGregorian(dateString) {
  const cleaned = persianToEnglish(dateString.replace(/\//g, "-"));
  const [jy, jm, jd] = cleaned.split('-').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

export default function Step3_PreviewPayment({ form, setForm, onNext, onBack }) {
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

  async function handlePay() {
    let formattedBirthDate = null;

    if (form.birthDate && typeof form.birthDate.convert === 'function' && typeof form.birthDate.format === 'function') {
      formattedBirthDate = persianToEnglish(form.birthDate.convert('gregorian').format("YYYY-MM-DD"));
    } else if (form.birthDate && typeof form.birthDate === 'object' && typeof form.birthDate.toDate === 'function') {
      formattedBirthDate = form.birthDate.toISOString().substring(0, 10);
    } else if (typeof form.birthDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(persianToEnglish(form.birthDate))) {
      formattedBirthDate = jalaliToGregorian(form.birthDate);
    } else if (typeof form.birthDate === 'string' && form.birthDate.includes('/')) {
      formattedBirthDate = persianToEnglish(form.birthDate.replace(/\//g, "-"));
    } else {
      formattedBirthDate = form.birthDate;
    }

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
    let fileUrls = [];
    if (form.mediaUploads && form.mediaUploads.length > 0) {
      for (let i = 0; i < form.mediaUploads.length; i++) {
        const { tempPath, uniqueName } = form.mediaUploads[i];
        const newPath = `consultations/${consultationId}/${uniqueName}`;
        const file = form.media[i]; // This is just for file.type or original name display
        console.log(
          '[Move Attempt]',
          'tempPath:', JSON.stringify(tempPath),
          'exists in UI?', 'consultationId:', consultationId
        );

        const { error: moveError } = await supabase.storage.from('media').move(tempPath, newPath);
        if (moveError) {
          console.error('Move error:', moveError);
          continue;
        }
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(newPath);
        const publicUrl = urlData.publicUrl;
        fileUrls.push(publicUrl);

        await supabase.from('media_files').insert([{
          consultation_id: consultationId,
          file_url: publicUrl,
          file_type: file?.type || 'unknown',
          file_name: file?.name || uniqueName
        }]);
      }
      setForm(f => ({ ...f, mediaUrls: fileUrls }));
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
            {form.media?.map((file, idx) => {
              let preview = null;
              const displayName = file.name
                ? file.name.length > 19 ? file.name.substring(0, 19) + "..." : file.name
                : file.type === "audio/webm" ? "voice message" : "file";

              if (file.type && file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                preview = (
                  <img
                    src={url}
                    alt={file.name || "تصویر"}
                    className="thumb-image"
                    onLoad={() => URL.revokeObjectURL(url)}
                    style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 7, marginLeft: 6 }}
                  />
                );
              } else if ((file.type === "application/pdf") || (file.name && file.name.toLowerCase().endsWith(".pdf"))) {
                preview = (
                  <span className="thumb-icon" title="PDF" style={{ color: "#b64bef", fontSize: "2em", marginLeft: 6 }}>
                    <span className="material-icons">picture_as_pdf</span>
                  </span>
                );
              } else if (file.type && file.type.startsWith("audio/")) {
                preview = (
                  <span className="thumb-icon" title="Voice" style={{ color: "#b64bef", fontSize: "2em", marginLeft: 6 }}>
                    <span className="material-icons">audiotrack</span>
                  </span>
                );
              } else {
                preview = (
                  <span className="thumb-icon" title="File" style={{ color: "#b64bef", fontSize: "2em", marginLeft: 6 }}>
                    <span className="material-icons">insert_drive_file</span>
                  </span>
                );
              }

              return (
                <div key={idx} className="thumb-preview">
                  {preview}
                  <span className="thumb-filename" style={{ fontSize: ".82em" }}>
                    {displayName}
                  </span>
                </div>
              );
            })}
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
