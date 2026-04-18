import "./CurvedLoop.css";

const DEFAULT_ITEMS = [
  "Animation",
  "Environment Art",
  "Perspective & Depth",
  "Character Design",
  "Lighting & Shading",
];

export default function CurvedLoop({
  items = DEFAULT_ITEMS,
  className = "",
  duration = 22,
}) {
  const safeItems = items.length ? items : DEFAULT_ITEMS;
  const loopItems = [...safeItems, ...safeItems];

  return (
    <div
      className={`rb-curved-loop ${className}`.trim()}
      style={{ "--rb-loop-duration": `${duration}s` }}
      aria-label="Currently learning topics"
    >
      <div className="rb-curved-loop-lane rb-curved-loop-lane-top">
        <div className="rb-curved-loop-track">
          {loopItems.map((item, idx) => (
            <span className="rb-curved-loop-chip" key={`top-${item}-${idx}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="rb-curved-loop-lane rb-curved-loop-lane-bottom">
        <div className="rb-curved-loop-track">
          {loopItems.map((item, idx) => (
            <span className="rb-curved-loop-chip" key={`bottom-${item}-${idx}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
