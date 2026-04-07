import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  value,
  onChange,
  name = "password",
  placeholder = "Enter password",
}) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "14px 45px 14px 14px",
          borderRadius: "10px",
          border: "none",
          background: "#333",
          color: "white",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: 0,
          margin: 0,
        }}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}