import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export function ClassesIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  const scale = size / 642;
  const height = 423 * scale;

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 642 423"
      fill="none"
      {...props}
    >
      <Path
        d="M56.58 53.5L11.66 53.5C11.57 53.5 11.5 53.5645 11.5 53.64L11.5 410.86C11.5 410.935 11.57 411 11.66 411L291.34 411C291.43 411 291.5 410.935 291.5 410.86L291.5 387.67L288.45 385.09C285.05 382.2 282.77 380.27 282.75 380.27L56.72 369.98C56.64 369.98 56.58 369.92 56.58 369.84L56.58 53.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />

      <Path
        d="M262 11L50.14 11C50.06 11 50 11.0645 50 11.14L50 370.28C50 370.36 50.06 370.43 50.14 370.43L275.78 380.73C275.86 380.73 312 411.58 312 411.5L303.41 51.08L299.88 36.22C298.13 31.26 296.05 27.25 293.74 24.48L292.56 23.8L292.36 23.34C289.96 20.62 285.9 18.16 280.59 16.1L262 11Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />

      <Path
        d="M132 80C132 73.65 137.15 68.5 143.5 68.5H229.5C235.85 68.5 241 73.65 241 80C241 86.35 235.85 91.5 229.5 91.5H143.5C137.15 91.5 132 86.35 132 80Z"
        fill={color}
      />
      <Path
        d="M104 133C104 126.65 109.15 121.5 115.5 121.5H257.5C263.85 121.5 269 126.65 269 133C269 139.35 263.85 144.5 257.5 144.5H115.5C109.15 144.5 104 139.35 104 133Z"
        fill={color}
      />
      <Path
        d="M107 185.5C107 178.87 112.37 173.5 119 173.5H253C259.63 173.5 265 178.87 265 185.5C265 192.13 259.63 197.5 253 197.5H119C112.37 197.5 107 192.13 107 185.5Z"
        fill={color}
      />
      <Path
        d="M104 238.5C104 231.87 109.37 226.5 116 226.5H257C263.63 226.5 269 231.87 269 238.5C269 245.13 263.63 250.5 257 250.5H116C109.37 250.5 104 245.13 104 238.5Z"
        fill={color}
      />
      <Path
        d="M120 291C120 284.65 125.15 279.5 131.5 279.5H240.5C246.85 279.5 252 284.65 252 291C252 297.35 246.85 302.5 240.5 302.5H131.5C125.15 302.5 120 297.35 120 291Z"
        fill={color}
      />

      <Path
        d="M585.42 53.5L630.34 53.5C630.43 53.5 630.5 53.5645 630.5 53.64L630.5 410.86C630.5 410.935 630.43 411 630.34 411L350.66 411C350.57 411 350.5 410.935 350.5 410.86L350.5 387.67L353.55 385.09C356.95 382.2 359.23 380.27 359.25 380.27L585.28 369.98C585.36 369.98 585.42 369.92 585.42 369.84L585.42 53.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M372.53 11L585.36 11C585.44 11 585.5 11.0645 585.5 11.14L585.5 370.28C585.5 370.36 585.44 370.43 585.36 370.43L358.86 380.73C358.78 380.73 322.5 411.58 322.5 411.5L331.12 51.08L334.67 36.22C336.42 31.26 338.51 27.25 340.83 24.48L342.01 23.8L342.22 23.34C344.63 20.62 348.7 18.16 354.03 16.1L372.53 11Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />

      <Path
        d="M401 80C401 73.65 406.15 68.5 412.5 68.5H498.5C504.85 68.5 510 73.65 510 80C510 86.35 504.85 91.5 498.5 91.5H412.5C406.15 91.5 401 86.35 401 80Z"
        fill={color}
      />
      <Path
        d="M373 133C373 126.65 378.15 121.5 384.5 121.5H526.5C532.85 121.5 538 126.65 538 133C538 139.35 532.85 144.5 526.5 144.5H384.5C378.15 144.5 373 139.35 373 133Z"
        fill={color}
      />
      <Path
        d="M376 185.5C376 178.87 381.37 173.5 388 173.5H522C528.63 173.5 534 178.87 534 185.5C534 192.13 528.63 197.5 522 197.5H388C381.37 197.5 376 192.13 376 185.5Z"
        fill={color}
      />
      <Path
        d="M373 238.5C373 231.87 378.37 226.5 385 226.5H526C532.63 226.5 538 231.87 538 238.5C538 245.13 532.63 250.5 526 250.5H385C378.37 250.5 373 245.13 373 238.5Z"
        fill={color}
      />
      <Path
        d="M389 291C389 284.65 394.15 279.5 400.5 279.5H509.5C515.85 279.5 521 284.65 521 291C521 297.35 515.85 302.5 509.5 302.5H400.5C394.15 302.5 389 297.35 389 291Z"
        fill={color}
      />
    </Svg>
  );
}

export function TasksIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 585; // 585 is original width
  const height = 559 * scale; // 559 is original height

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 585 559"
      fill="none"
      {...props}
    >
      <Path
        d="M18.07 11.5h425.86c3.63 0 6.57 2.94 6.57 6.57v89.4h-309.26c-3.63 0-6.57 2.94-6.57 6.57v337.46H18.07c-3.63 0-6.57-2.94-6.57-6.57V18.07c0-3.63 2.94-6.57 6.57-6.57z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M304.87 417.22c-7.74-7.69-7.78-20.21-.08-27.95l143.49-144.38c7.69-7.75 20.21-7.78 27.95-.09v0c7.74 7.7 7.78 20.21.08 27.95L333.83 417.13c-7.7 7.75-20.21 7.79-27.96.09z"
        fill={color}
      />
      <Path
        d="M231.95 318.81c7.57-7.62 19.88-7.66 27.5-.09l71.57 71.13c7.62 7.57 7.66 19.89.09 27.51v0c-7.57 7.62-19.89 7.66-27.51.08l-71.57-71.12c-7.62-7.58-7.66-19.89-.08-27.51z"
        fill={color}
      />
      <Path
        d="M134.5 114.07c0-3.63 2.94-6.57 6.57-6.57h425.86c3.63 0 6.57 2.94 6.57 6.57v426.86c0 3.63-2.94 6.57-6.57 6.57H141.07c-3.63 0-6.57-2.94-6.57-6.57V114.07z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
    </Svg>
  );
}

export function GroupsIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 636; // 636 is original width
  const height = 448 * scale; // 448 is original height

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 636 448"
      fill="none"
      {...props}
    >
      <Path
        d="M237.5 92C237.5 47.54 273.54 11.5 318 11.5C362.46 11.5 398.5 47.54 398.5 92C398.5 136.46 362.46 172.5 318 172.5C273.54 172.5 237.5 136.46 237.5 92Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M504.96 233.5C557.5 233.5 602.58 269.58 621.84 321L624.5 330.68V386.27C624.5 396.89 615.89 405.5 605.27 405.5H477.39V336.42L473.83 323.48C467.4 306.3 458.8 290.39 448.44 276.21L433.5 258.51L434.03 257.97C454.28 242.52 478.68 233.5 504.96 233.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M445.5 138.5C445.5 104.81 473.03 77.5 507 77.5C540.97 77.5 568.5 104.81 568.5 138.5C568.5 172.19 540.97 199.5 507 199.5C473.03 199.5 445.5 172.19 445.5 138.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M131.04 233.5C157.32 233.5 181.72 242.52 201.97 257.97L202.5 258.51L187.56 276.21C177.2 290.39 168.6 306.3 162.17 323.48L158.61 336.42V405.5H30.73C20.11 405.5 11.5 396.89 11.5 386.27V330.68L14.16 321C33.42 269.58 78.5 233.5 131.04 233.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M71.5 138.5C71.5 104.81 99.03 77.5 133 77.5C166.97 77.5 194.5 104.81 194.5 138.5C194.5 172.19 166.97 199.5 133 199.5C99.03 199.5 71.5 172.19 71.5 138.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
      <Path
        d="M318 207.5C388.11 207.5 448.26 255.53 473.95 323.99L477.5 336.88V410.9C477.5 425.04 466.02 436.5 451.85 436.5H184.15C169.98 436.5 158.5 425.04 158.5 410.9V336.89L162.05 323.99C187.75 255.53 247.9 207.5 318 207.5Z"
        stroke={color}
        strokeWidth={22.9167}
        strokeMiterlimit={8}
        fill="none"
      />
    </Svg>
  );
}

export function MenuIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 339; // 339 is original width
  const height = 265 * scale; // 265 is original height

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 339 265"
      fill="none"
      {...props}
    >
      <Path
        d="M0 19.5C0 8.73 8.73 0 19.5 0L319.5 0C330.27 0 339 8.73 339 19.5V19.5C339 30.27 330.27 39 319.5 39L19.5 39C8.73 39 0 30.27 0 19.5Z"
        fill={color}
      />
      <Path
        d="M0 132.5C0 121.73 8.731 113 19.5 113L319.5 113C330.27 113 339 121.73 339 132.5V132.5C339 143.27 330.269 152 319.5 152L19.5 152C8.731 152 0 143.27 0 132.5Z"
        fill={color}
      />
      <Path
        d="M0 245.5C0 234.73 8.731 226 19.5 226L319.5 226C330.27 226 339 234.73 339 245.5V245.5C339 256.27 330.269 265 319.5 265L19.5 265C8.731 265 0 256.27 0 245.5Z"
        fill={color}
      />
    </Svg>
  );
}

export function SearchIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 517; // 517 is original width
  const height = Math.round(522 * scale); // 522 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (299, 1341)
  const circle =
    "M11.5 185.5C11.5 89.4 89.402 11.5 185.5 11.5 281.598 11.5 359.5 89.4 359.5 185.5 359.5 281.6 281.598 359.5 185.5 359.5 89.402 359.5 11.5 281.6 11.5 185.5Z";
  const handle =
    "M304.966 307.84C318.052 294.96 339.099 295.13 351.976 308.21L506.491 465.24C519.368 478.33 519.199 499.37 506.112 512.25L506.112 512.25C493.026 525.13 471.979 524.96 459.102 511.87L304.588 354.84C291.711 341.76 291.88 320.71 304.966 307.83Z";

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 517 522"
      fill="none"
      {...props}
    >
      <Path
        d={circle}
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />
      <Path d={handle} fill={color} fillRule="evenodd" />
    </Svg>
  );
}

export function MicrophoneIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 353; // 353 is original width
  const height = Math.round(576 * scale); // 576 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (1353, 1290)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 353 576"
      fill="none"
      {...props}
    >
      {/* Main microphone body */}
      <Path
        d="M96.5 92C96.5 47.54 132.54 11.5 177 11.5L177 11.5C221.46 11.5 257.5 47.54 257.5 92L257.5 301C257.5 345.46 221.46 381.5 177 381.5L177 381.5C132.54 381.5 96.5 345.46 96.5 301Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Half-circle stand */}
      <Path
        d="M341.5 292.53C341.49 383.65 267.6 457.51 176.47 457.5 85.35 457.49 11.49 383.6 11.5 292.47 11.5 292.1 11.5 291.72 11.5 291.35"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Base rectangle */}
      <Path
        d="M22 556C22 544.95 30.95 536 42 536L310 536C321.05 536 330 544.95 330 556L330 556C330 567.05 321.05 576 310 576L42 576C30.95 576 22 567.05 22 556Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Vertical stand connector */}
      <Path
        d="M176 459C187.05 459 196 467.95 196 479L196 555C196 566.05 187.05 575 176 575L176 575C164.95 575 156 566.05 156 555L156 479C156 467.95 164.95 459 176 459Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Right rounded cap for half-circle */}
      <Path
        d="M341.5 260C347.85 260 353 265.15 353 271.5L353 291.5C353 297.85 347.85 303 341.5 303L341.5 303C335.15 303 330 297.85 330 291.5L330 271.5C330 265.15 335.15 260 341.5 260Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Left rounded cap for half-circle */}
      <Path
        d="M11.5 260C17.85 260 23 265.15 23 271.5L23 291.5C23 297.85 17.85 303 11.5 303L11.5 303C5.15 303 0 297.85 0 291.5L0 271.5C0 265.15 5.15 260 11.5 260Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function CheckIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 257; // 257 is original width
  const height = Math.round(185 * scale); // 185 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (2380, 1471)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 257 185"
      fill="none"
      {...props}
    >
      {/* Long diagonal stroke */}
      <Path
        d="M79.42 178.26C71.67 170.57 71.63 158.05 79.33 150.31L222.82 5.93C230.51 -1.81 243.03 -1.85 250.77 5.84L250.77 5.84C258.51 13.54 258.55 26.05 250.86 33.8L107.37 178.18C99.67 185.92 87.16 185.96 79.42 178.26Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Short diagonal stroke */}
      <Path
        d="M6.49 79.85C14.06 72.23 26.37 72.19 33.99 79.77L105.56 150.89C113.18 158.47 113.22 170.78 105.65 178.4L105.65 178.4C98.08 186.02 85.76 186.06 78.14 178.49L6.57 107.36C-1.05 99.79 -1.09 87.47 6.49 79.85Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function XIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scalingFactor = 0.8;
  const scale = (size / 184) * scalingFactor; // 184 is original width
  const height = Math.round(185 * scale); // 185 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (3466, 1471)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 184 185"
      fill="none"
      {...props}
    >
      {/* Top-left to bottom-right diagonal */}
      <Path
        d="M6.33 178.27C-1.41 170.57 -1.45 158.06 6.24 150.31L149.73 5.93C157.43 -1.81 169.94 -1.85 177.69 5.84L177.68 5.84C185.43 13.54 185.47 26.05 177.77 33.8L34.28 178.18C26.59 185.92 14.07 185.96 6.33 178.26Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Top-right to bottom-left diagonal */}
      <Path
        d="M178.22 177.2C170.52 184.94 158.01 184.98 150.26 177.28L5.88 33.8C-1.86 26.1 -1.9 13.59 5.8 5.84L5.8 5.84C13.49 -1.9 26.01 -1.94 33.75 5.76L178.13 149.24C185.87 156.94 185.91 169.45 178.22 177.2Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function EventIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 571; // 571 is original width
  const height = Math.round(594 * scale); // 594 is original height

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 571 594"
      fill="none"
      {...props}
    >
      {/* Calendar outline broken into segments to appear behind tabs */}

      {/* Left segment */}
      <Path
        d="M11.5 112.81C11.5 92.75 27.75 76.5 47.81 76.5L105 76.5"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Center segment */}
      <Path
        d="M195 76.5L375 76.5"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Right segment */}
      <Path
        d="M465 76.5L523.19 76.5C543.25 76.5 559.5 92.75 559.5 112.81L559.5 546.19C559.5 566.25 543.25 582.5 523.19 582.5L47.81 582.5C27.75 582.5 11.5 566.25 11.5 546.19L11.5 112.81"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Calendar header divider line */}
      <Path d="M19 201H552V224H19Z" fill={color} />

      {/* Left hanging tab */}
      <Path
        d="M111.5 26.44C111.5 18.19 118.19 11.5 126.44 11.5L173.56 11.5C181.81 11.5 188.5 18.19 188.5 26.44L188.5 108.56C188.5 116.81 181.81 123.5 173.56 123.5L126.44 123.5C118.19 123.5 111.5 116.81 111.5 108.56Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Right hanging tab */}
      <Path
        d="M382.5 26.63C382.5 18.27 389.27 11.5 397.63 11.5L445.37 11.5C453.73 11.5 460.5 18.27 460.5 26.63L460.5 108.37C460.5 116.73 453.73 123.5 445.37 123.5L397.63 123.5C389.27 123.5 382.5 116.73 382.5 108.37Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Star with rounded edges */}
      <Path
        d="M165.5 362.21
        C165.5 362.21 237.18 349.64 243.18 349.64
        C249.18 349.64 275.5 275.5 278.5 275.5
        C281.5 275.5 307.82 349.64 313.82 349.64
        C319.82 349.64 391.5 362.21 391.5 362.21
        C391.5 362.21 338.65 417.59 335.65 420.59
        C332.65 423.59 348.34 502.5 348.34 502.5
        C348.34 502.5 281.5 464.45 278.5 464.45
        C275.5 464.45 208.66 502.5 208.66 502.5
        C208.66 502.5 224.35 423.59 221.35 420.59
        C218.35 417.59 165.5 362.21 165.5 362.21Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  );
}
