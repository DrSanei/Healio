import "../styles/Step2_DescriptionMedia.css";
import { useRef, useState } from "react";
import FixedActionBar from "../components/FixedActionBar";

export default function Step2_DescriptionMedia({ form, setForm, onNext, onBack }) {
  const fileInput = useRef();

  // --- Audio Recording ---
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  // Attach any file
  const addFile = (e) => {
    const files = Array.from(e.target.files || []);
    setForm(f => ({ ...f, media: [...f.media, ...files] }));
    // reset capture/accept in case of camera to normal after one use
    fileInput.current.removeAttribute("capture");
    fileInput.current.setAttribute("accept", "*");
  };

  const removeMedia = idx => {
    setForm(f => ({ ...f, media: f.media.filter((_, i) => i !== idx) }));
  };

  // Audio record logic
  const handleAudioRecord = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newRecorder = new MediaRecorder(stream);
        let chunks = [];
        newRecorder.ondataavailable = e => chunks.push(e.data);
        newRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          // Add name for consistent display
          blob.name = `voice_${Date.now()}.webm`;
          setForm(f => ({ ...f, media: [...f.media, blob] }));
        };
        setRecorder(newRecorder);
        setRecording(true);
        newRecorder.start();
      } catch (e) {
        alert("اجازه ضبط صدا داده نشد یا امکان‌پذیر نیست.");
      }
    } else {
      recorder.stop();
      setRecorder(null);
      setRecording(false);
    }
  };

  // Camera photo/video logic (uses input with capture)
  const handleCamera = () => {
    // Only show capture for camera (mobile friendly)
    fileInput.current.setAttribute("capture", "environment");
    fileInput.current.setAttribute("accept", "image/*,video/*");
    fileInput.current.click();
  };

  // When user clicks normal attach, reset
  const handleAttachClick = () => {
    fileInput.current.removeAttribute("capture");
    fileInput.current.setAttribute("accept", "*");
    fileInput.current.click();
  };

  const handleNext = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <>
      <form className="step2-form" onSubmit={handleNext}>
        <div className="form-group">
          <label>شرح بیماری</label>
          <textarea
            rows={6}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="media-buttons-row">
          {/* Camera Button */}
          <button
            type="button"
            className="media-btn"
            title="دوربین"
            onClick={handleCamera}
          >
            <span className="material-icons">photo_camera</span>
            <span style={{ fontSize: "0.85em" }}>دوربین</span>
          </button>
          {/* Audio Button */}
          <button
            type="button"
            className={`media-btn ${recording ? "recording" : ""}`}
            title="ضبط صدا"
            onClick={handleAudioRecord}
          >
            <span className="material-icons">
              {recording ? "stop_circle" : "mic"}
            </span>
            <span style={{ fontSize: "0.85em" }}>{recording ? "پایان ضبط" : "ضبط صدا"}</span>
          </button>
          {/* Attach file Button */}
          <button
            type="button"
            className="media-btn"
            title="پیوست فایل"
            onClick={handleAttachClick}
          >
            <span className="material-icons">attach_file</span>
            <span style={{ fontSize: "0.85em" }}>فایل</span>
          </button>
          {/* Hidden file input */}
          <input
            type="file"
            multiple
            hidden
            ref={fileInput}
            onChange={addFile}
          />
        </div>
        <div className="media-thumbs">
          {form.media?.map((file, idx) =>
            <div key={idx} className="thumb-preview">
              <span className="material-icons" onClick={() => removeMedia(idx)}>close</span>
              <span>
                {file.name
                  ? file.name
                  : file.type === "audio/webm"
                  ? "voice message"
                  : "file"}
              </span>
            </div>
          )}
        </div>
      </form>
      <FixedActionBar onBack={onBack} onNext={onNext} />
    </>
  );
}
