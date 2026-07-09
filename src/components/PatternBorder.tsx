export function PatternBorder() {
  const colors = ["#1E88E5", "#FB8C00", "#E53935", "#FDD835"];
  const shapes = Array.from({ length: 24 }, (_, i) => {
    const color = colors[i % colors.length];
    const type = i % 3;
    return (
      <div
        key={i}
        className="shrink-0"
        style={{
          width: type === 0 ? 20 : type === 1 ? 16 : 12,
          height: type === 0 ? 20 : type === 1 ? 16 : 12,
          backgroundColor: color,
          borderRadius: type === 0 ? "50%" : type === 1 ? "2px" : "50% 50% 0 0",
          transform: type === 2 ? "rotate(180deg)" : undefined,
          opacity: 0.85,
        }}
      />
    );
  });

  return (
    <div className="w-full overflow-hidden bg-[#0a1628] py-3">
      <div className="flex items-center justify-center gap-3 px-4">{shapes}</div>
    </div>
  );
}
