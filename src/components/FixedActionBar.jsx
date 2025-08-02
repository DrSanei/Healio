import "../styles/FixedActionBar.css";

export default function FixedActionBar({
  onBack,
  onNext,
  nextLabel = "ادامه",
  backLabel = "بازگشت",
  disableNext
}) {
  return (
    <div className="fixed-action-bar-container">
      <div className="fixed-action-bar">
        
        <button
          type="button"
          className="primary-btn"
          onClick={onNext}
          disabled={disableNext}
        >
          {nextLabel}
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={onBack}
        >
          {backLabel}
        </button>
      </div>
    </div>
  );
}
