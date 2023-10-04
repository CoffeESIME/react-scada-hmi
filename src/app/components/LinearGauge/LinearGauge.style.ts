export const needleStyle = (needleSize: number, color: string, value: number) => ({
    width: "0",
    height: "0",
    borderLeft: `${needleSize}px solid transparent`,
    borderRight: `${needleSize}px solid transparent`,
    borderBottom: `${needleSize}px solid ${color}`,
    position: "absolute" as "absolute",
    bottom: `${value - 1}%`,
    left: "-50%",
    transform: "rotate(90deg)",
    zIndex: 3,
});
