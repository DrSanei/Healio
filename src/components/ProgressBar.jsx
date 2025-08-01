import "../styles/ProgressBar.css";

export default function ProgressBar({ step, total }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="progress-bar">
      {steps.map(i => (
        <div
          key={i}
          className={`progress-step${i <= step ? " active" : ""}`}
        >
          {i}
        </div>
      ))}
    </div>
  );
}
