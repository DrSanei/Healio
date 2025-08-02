export default function LoadingBar({ percent = 0 }) {
  return (
    <div style={{ width: "100%", background: "#eee", height: 8, borderRadius: 5, margin: "16px 0" }}>
      <div
        style={{
          width: percent + "%",
          background: "#26c6da",
          height: "100%",
          borderRadius: 5,
          transition: "width 0.3s",
        }}
      />
    </div>
  );
}
