import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function PersianDatePicker({ value, onChange }) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={value}
      onChange={onChange}
      style={{ width: "100%", fontFamily: "inherit" }}
      inputClass="persian-date-input"
      calendarPosition="bottom-right"
      placeholder="انتخاب تاریخ"
      format="YYYY/MM/DD"
    />
  );
}
