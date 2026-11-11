type Props = {
  className?: string;
};

/** Navy circle with the open book and saffron flame. The name sits beside it in text. */
export function BrandMark({ className = "h-9 w-9" }: Props) {
  return (
    <img
      src="/brand/logo-mark.svg"
      alt=""
      width={128}
      height={128}
      className={`shrink-0 ${className}`}
    />
  );
}
