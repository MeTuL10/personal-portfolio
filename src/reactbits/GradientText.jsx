import "./GradientText.css";

export default function GradientText({
  text = "",
  as: Tag = "h1",
  className = "",
  colorA = "#ffffff",
  colorB = "var(--art-bright, #49b8ff)",
  colorC = "var(--art-color, #185fa5)",
  speed = 8,
  angle = 100,
  animated = true,
  style,
}) {
  return (
    <Tag
      className={`rb-gradient-text ${animated ? "" : "rb-gradient-text-static"} ${className}`.trim()}
      style={{
        "--rb-gradient-a": colorA,
        "--rb-gradient-b": colorB,
        "--rb-gradient-c": colorC,
        "--rb-gradient-speed": `${speed}s`,
        "--rb-gradient-angle": `${angle}deg`,
        ...style,
      }}
    >
      {text}
    </Tag>
  );
}
