// pages/index.js
export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Vazirmatn, IRANSans, Tahoma, Arial, sans-serif",
      }}
    >
      <img src="/logo.png" alt="Healio" style={{ width: 120, marginBottom: 32 }} />
      <h1>به هیلیو خوش آمدید!</h1>
      <p style={{ marginTop: 16, marginBottom: 32, fontSize: "1.1em", color: "#555" }}>
        برای مشاوره پزشکی آنلاین، روی دکمه زیر کلیک کنید.
      </p>
      <a
        href="/step1"
        style={{
          background: "#b64bef",
          color: "#fff",
          padding: "14px 38px",
          borderRadius: "16px",
          textDecoration: "none",
          fontSize: "1.2em",
          fontWeight: "bold",
        }}
      >
        شروع مشاوره
      </a>
    </div>
  );
}
