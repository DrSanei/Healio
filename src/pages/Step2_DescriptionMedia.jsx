import "../styles/Step2_DescriptionMedia.css";
import { useRef, useState } from "react";
import FixedActionBar from "../components/FixedActionBar";
import LoadingBar from "../components/LoadingBar";
import { supabase } from '../supabaseClient';

export default function Step2_DescriptionMedia({ form, setForm, onNext, onBack }) {
  const fileInput = useRef();
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addFile = (e) => {
    const files = Array.from(e.target.files || []);
    setForm(f => ({ ...f, media: [...f.media, ...files] }));
    fileInput.current.removeAttribute("capture");
    fileInput.current.setAttribute("accept", "*");
  };

  const removeMedia = idx => {
    setForm(f => ({ ...f, media: f.media.filter((_, i) => i !== idx) }));
  };

  const handleAudioRecord = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newRecorder = new MediaRecorder(stream);
        let chunks = [];
        newRecorder.ondataavailable = e => chunks.push(e.data);
        newRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
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

  const handleCamera = () => {
    fileInput.current.setAttribute("capture", "environment");
    fileInput.current.setAttribute("accept", "image/*,video/*");
    fileInput.current.click();
  };

  const handleAttachClick = () => {
    fileInput.current.removeAttribute("capture");
    fileInput.current.setAttribute("accept", "*");
    fileInput.current.click();
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (form.media.length === 0) {
      onNext();
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Define upload promises
    const uploadPromises = form.media.map((file, index) => {
      const uniqueName = `${Date.now()}_${index}_${file.name || 'file'}`;
      const tempPath = `temp/${uniqueName}`;
      return supabase.storage.from('media').upload(tempPath, file).then(({ data, error }) => {
        if (error) {
          console.error('Upload error:', error);
          return null;
        }
        return tempPath;
      });
    });

    // Start timer to increase progress by 2% every second
    const intervalId = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 2;
        return next < 100 ? next : 100;
      });
    }, 1000);

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Clear the interval
    clearInterval(intervalId);

    // Set progress to 100%
    setUploadProgress(100);

    // Wait a bit for the progress bar to update
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Process results
    const tempPaths = results.filter((path) => path !== null);
    setForm((f) => ({ ...f, mediaTempPaths: tempPaths }));

    // Proceed to next step
    setIsUploading(false);
    onNext();
  };

  if (isUploading) {
    return (
      <div style={{ textAlign: 'center', margin: '32px auto' }}>
        <p>در حال بارکزاری </p>
        <LoadingBar percent={uploadProgress} />
      </div>
    );
  }
// <p>در حال بارکزاری {Math.round(uploadProgress)}%</p>


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
        
          <button type="button" className="media-btn" title="پیوست فایل" onClick={handleAttachClick}>
            <span className="material-icons">attach_file</span>
            <span style={{ fontSize: "0.85em" }}>فایل</span>
          </button>
          <input type="file" multiple hidden ref={fileInput} onChange={addFile} />
            <button type="button" className="media-btn" title="دوربین" onClick={handleCamera}>
            <span className="material-icons">photo_camera</span>
            <span style={{ fontSize: "0.85em" }}>دوربین</span>
          </button>
          
          <button type="button" className={`media-btn ${recording ? "recording" : ""}`} title="ضبط صدا" onClick={handleAudioRecord}>
            <span className="material-icons">{recording ? "stop_circle" : "mic"}</span>
            <span style={{ fontSize: "0.85em" }}>{recording ? "پایان ضبط" : "ضبط صدا"}</span>
          </button>
        </div>
        <div className="media-thumbs">
          {form.media?.map((file, idx) => (
            <div key={idx} className="thumb-preview">
              <span className="material-icons" onClick={() => removeMedia(idx)}>close</span>
              <span>
                {file.name
                  ? file.name.length > 19 ? file.name.substring(0, 19) + "..." : file.name
                  : file.type === "audio/webm" ? "voice message" : "file"}
              </span>
            </div>
          ))}
        </div>
      </form>
      <FixedActionBar onBack={onBack} onNext={handleNext} />
    </>
  );
}