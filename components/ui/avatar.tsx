type Props = {
  src?: string | null;
  size?: number;
};

export default function Avatar({ src, size = 40 }: Props) {
  const normalizedSrc = src?.trim();

  if (!normalizedSrc) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#d9e7f5",
          color: "#1c2a44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.max(12, Math.floor(size * 0.35)),
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        U
      </div>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  );
}
