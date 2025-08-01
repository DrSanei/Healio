import "../styles/Step2_DescriptionMedia.css";
import { useRef } from "react";

export default function Step2_DescriptionMedia({ form, setForm, onNext, onBack }) {
  const fileInput = useRef();
  const addFile = (e) => {
    const files = Array.from(e.target.files || []);
    setForm(f => ({...f, media: [...f.media, ...files]}));
  };
  const removeMedia = idx => {
    setForm(f => ({...f, media: f.media.filter((_, i) => i !== idx)}));
  };

  const handleNext = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="step2-form" onSubmit={handleNext}>
      <div className="form-group">
        <label>شرح بیماری</label>
        <textarea rows={3}
          value={form.description}
          onChange={e => setForm(f => ({...f, description: e.target.value}))}
        />
      </div>
      <div className="media-buttons-row">
        <label className="media-btn">
          <span className="material-icons">attach_file</span>
          <span>فایل</span>
          <input type="file" multiple hidden onChange={addFile} ref={fileInput} />
        </label>
      </div>
      <div className="media-thumbs">
        {form.media?.map((file, idx) =>
          <div key={idx} className="thumb-preview">
            <span className="material-icons" onClick={() => removeMedia(idx)}>close</span>
            <span>{file.name}</span>
          </div>
        )}
      </div>
      <div className="actions-row">
        <button type="button" className="secondary-btn" onClick={onBack}>بازگشت</button>
        <button type="submit" className="primary-btn">ادامه</button>
      </div>
    </form>
  );
}
