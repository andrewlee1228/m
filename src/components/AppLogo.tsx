import type { SVGProps } from 'react';

const AppLogo = (props: SVGProps<SVGSVGElement> & { textColor?: string }) => {
  const { textColor = "hsl(var(--primary))", ...rest } = props;
  return (
    <svg
      width="120"
      height="36"
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Axxel Logo"
      {...rest}
    >
      <path
        d="M18.66 30.5L26.18 6.5H31.82L24.3 30.5H18.66ZM32.64 30.5L40.16 6.5H45.8L38.28 30.5H32.64Z"
        fill={textColor}
      />
      <path
        d="M52.5 6.5C55.5 6.5 57.88 7.46 59.64 9.38C61.4 11.3 62.28 13.76 62.28 16.76C62.28 19.76 61.4 22.22 59.64 24.14C57.88 26.06 55.5 27.02 52.5 27.02H49.56V30.5H44.52V6.5H52.5ZM52.5 23.18C54.06 23.18 55.26 22.64 56.1 21.56C56.94 20.48 57.36 18.86 57.36 16.7C57.36 14.54 56.94 12.92 56.1 11.84C55.26 10.76 54.06 10.22 52.5 10.22H49.56V23.18H52.5Z"
        fill={textColor}
      />
      <path
        d="M68.12 30.5V6.5H73.16V26.9H81.8V30.5H68.12Z"
        fill={textColor}
      />
      <path
        d="M87.74 30.5V6.5H92.78V26.9H101.42V30.5H87.74Z"
        fill={textColor}
      />
      {/* A stylized "A" for icon part */}
      <path
        d="M10 30.5L0 6.5H6L10 16.5L14 6.5H20L10 30.5Z"
        fill="hsl(var(--accent))"
      />
    </svg>
  );
};

export default AppLogo;
