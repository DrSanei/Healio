import "../styles/Step1_PatientInfo.css";
import { useState } from "react";
import PersianDatePicker from "../components/PersianDatePicker";
import FixedActionBar from "../components/FixedActionBar";

export default function Step1_PatientInfo({ form, setForm, onNext, onBack = () => {} }) {  const [errors, setErrors] = useState({});

  const validate = () => {
    let errs = {};
    if (!form.firstName) errs.firstName = "لطفا نام را وارد کنید";
    if (!form.lastName) errs.lastName = "لطفا نام خانوادگی را وارد کنید";
    if (!form.birthDate) errs.birthDate = "تاریخ تولد را وارد کنید";
    if (!form.gender) errs.gender = "جنسیت را انتخاب کنید";
    if (!/^\d{10}$/.test(form.nationalCode)) errs.nationalCode = "کد ملی باید ده رقمی باشد";
    if (!/^09\d{9}$/.test(form.mobile)) errs.mobile = "شماره همراه معتبر وارد کنید";
    if (!form.doctorId) errs.doctorId = "پزشک را انتخاب کنید";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onNext();
  };

  return (
    <>
    <form className="step1-form" onSubmit={handleNext}>
      <div className="small-logo"><img src="/logo.png" alt="Healio" /></div>
      <div className="form-group">
        <label>نام</label>
        <input value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))}/>
        {errors.firstName && <div className="error">{errors.firstName}</div>}
      </div>
      <div className="form-group">
        <label>نام خانوادگی</label>
        <input value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))}/>
        {errors.lastName && <div className="error">{errors.lastName}</div>}
      </div>
      <div className="form-group">
        <label>تاریخ تولد</label>
        <PersianDatePicker value={form.birthDate} onChange={v => setForm(f => ({...f, birthDate: v}))}/>
        {errors.birthDate && <div className="error">{errors.birthDate}</div>}
      </div>
      <div className="form-group">
        <label>جنسیت</label>
        <select value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))}>
          <option value="">انتخاب کنید</option>
          <option value="male">مرد</option>
          <option value="female">زن</option>
        </select>
        {errors.gender && <div className="error">{errors.gender}</div>}
      </div>
      <div className="form-group">
        <label>کد ملی</label>
        <input value={form.nationalCode} onChange={e => setForm(f => ({...f, nationalCode: e.target.value}))}/>
        {errors.nationalCode && <div className="error">{errors.nationalCode}</div>}
      </div>
      <div className="form-group">
        <label>شماره همراه (واتساپ)</label>
        <input value={form.mobile} onChange={e => setForm(f => ({...f, mobile: e.target.value}))}/>
        {errors.mobile && <div className="error">{errors.mobile}</div>}
      </div>
      <div className="form-group">
        <label>پزشک مورد نظر</label>
        <select value={form.doctorId} onChange={e => setForm(f => ({...f, doctorId: e.target.value}))}>
          <option value="">انتخاب کنید</option>
          <option value="1">دکتر احمدی - داخلی</option>
          <option value="2">دکتر فاطمی - پوست</option>
        </select>
        {errors.doctorId && <div className="error">{errors.doctorId}</div>}
      </div>
    </form>
     <FixedActionBar onBack={onBack} onNext={handleNext} />
    </>
     );
}
