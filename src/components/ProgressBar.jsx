import "../styles/ProgressBar.css";

export default function ProgressBar({ step = 1, total = 5 }) {
  const labels = ["اطلاعات", "شرح بیماری", "پیش‌نمایش", "پرداخت", "تایید"];

  return (
    <div className="progressbar-root">
      <div className="progressbar-steps">
        {Array.from({ length: total }).map((_, i) => {
          const status =
            i + 1 < step
              ? "completed"
              : i + 1 === step
              ? "active"
              : "upcoming";
          return (
            <div className="progressbar-step" key={i}>
              {/* Connector line only for steps 2–5 (not before 1, not after 5) */}
              {i !== 0 && (
                <div
                  className={`progressbar-connector ${
                    i < step ? "filled" : ""
                  }`}
                ></div>
              )}
              <div className={`progressbar-circle ${status}`}>
                {i + 1}
              </div>
              <div className={`progressbar-label ${status}`}>
                {labels[i] || ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
