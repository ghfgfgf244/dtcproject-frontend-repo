type Props = {
  src: string;
  size?: number;
};

export default function Avatar({ src, size = 40 }: Props) {
  return (
    <img
      src={src}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
}