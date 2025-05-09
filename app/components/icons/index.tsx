import * as React from "react";
import { useTheme } from "tamagui";
import Svg, { Path, SvgProps, Circle } from "react-native-svg";

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

export function ClockIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 563; // 563 is original width
  const height = Math.round(564 * scale); // 564 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (1316, 1281)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 563 564"
      fill="none"
      {...props}
    >
      {/* Clock face circle */}
      <Path
        d="M11.5 282C11.5 132.61 132.38 11.5 281.5 11.5C430.62 11.5 551.5 132.61 551.5 282C551.5 431.39 430.62 552.5 281.5 552.5C132.38 552.5 11.5 431.39 11.5 282Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Hour hand (vertical) */}
      <Path
        d="M281.5 78C291.16 78 299 85.83 299 95.5L299 277.5C299 287.17 291.16 295 281.5 295L281.5 295C271.83 295 264 287.17 264 277.5L264 95.5C264 85.83 271.83 78 281.5 78Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Minute hand (horizontal) */}
      <Path
        d="M263 278C263 268.61 270.61 261 280 261L453 261C462.39 261 470 268.61 470 278L470 278C470 287.39 462.39 295 453 295L280 295C270.61 295 263 287.39 263 278Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function LocationIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 390; // 390 is original width
  const height = Math.round(630 * scale); // 630 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (352, 1261)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 390 630"
      fill="none"
      {...props}
    >
      {/* Inner circle of the map marker */}
      <Path
        d="M129.5 163C129.5 126.83 158.602 97.5 194.5 97.5C230.399 97.5 259.5 126.83 259.5 163C259.5 199.17 230.399 228.5 194.5 228.5C158.602 228.5 129.5 199.17 129.5 163Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Paper shape with folded bottom */}
      <Path
        d="M49.562 423.5L160.944 423.5L195 494.86L229.056 423.5L340.438 423.5L378.5 618.5L11.5 618.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
        fillRule="evenodd"
      />

      {/* Map marker outline */}
      <Path
        d="M194.5 11.5C275.134 11.5 340.5 77.08 340.5 157.97C340.5 188.31 331.308 216.49 315.565 239.87L314.861 240.72L194.5 494.5L74.139 240.72L73.435 239.87C57.692 216.49 48.5 188.31 48.5 157.97C48.5 77.08 113.866 11.5 194.5 11.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function UserCheckIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 555; // 555 is original width
  const height = Math.round(448 * scale); // 448 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (2314, 1349)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 555 448"
      fill="none"
      {...props}
    >
      {/* User head circle */}
      <Path
        d="M90.5 92C90.5 47.54 126.54 11.5 171 11.5C215.46 11.5 251.5 47.54 251.5 92C251.5 136.46 215.46 172.5 171 172.5C126.54 172.5 90.5 136.46 90.5 92Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* User body shape */}
      <Path
        d="M171 206.5C241.11 206.5 301.26 254.74 326.95 323.5L330.5 336.45L330.5 410.79C330.5 424.99 319.02 436.5 304.85 436.5L37.15 436.5C22.98 436.5 11.5 424.99 11.5 410.79L11.5 336.45L15.05 323.5C40.75 254.74 100.9 206.5 171 206.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Check mark - long diagonal */}
      <Path
        d="M396.15 254.52C389.25 247.66 389.21 236.51 396.07 229.61L523.92 100.97C530.77 94.07 541.92 94.04 548.82 100.89L548.82 100.89C555.72 107.75 555.75 118.9 548.9 125.8L421.05 254.44C414.2 261.34 403.04 261.38 396.15 254.52Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Check mark - short diagonal */}
      <Path
        d="M331.17 166.83C337.91 160.05 348.89 160.01 355.68 166.76L419.44 230.13C426.23 236.88 426.27 247.85 419.52 254.64L419.52 254.64C412.77 261.43 401.8 261.46 395.01 254.72L331.24 191.34C324.45 184.6 324.42 173.62 331.17 166.83Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function UserXIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 522; // 522 is original width
  const height = Math.round(448 * scale); // 448 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (3365, 1347)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 522 448"
      fill="none"
      {...props}
    >
      {/* User head circle */}
      <Path
        d="M90.5 92C90.5 47.54 126.54 11.5 171 11.5C215.46 11.5 251.5 47.54 251.5 92C251.5 136.46 215.46 172.5 171 172.5C126.54 172.5 90.5 136.46 90.5 92Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* User body shape */}
      <Path
        d="M171 206.5C241.11 206.5 301.26 254.74 326.95 323.5L330.5 336.45L330.5 410.79C330.5 424.99 319.02 436.5 304.85 436.5L37.15 436.5C22.98 436.5 11.5 424.99 11.5 410.79L11.5 336.45L15.05 323.5C40.75 254.74 100.9 206.5 171 206.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* X mark - top-left to bottom-right diagonal */}
      <Path
        d="M363.42 254.24C356.52 247.38 356.49 236.23 363.34 229.33L491.19 100.69C498.05 93.79 509.2 93.76 516.1 100.61L516.1 100.61C522.99 107.47 523.03 118.62 516.17 125.52L388.33 254.16C381.47 261.06 370.32 261.09 363.42 254.24Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* X mark - top-right to bottom-left diagonal */}
      <Path
        d="M516.57 252.13C509.71 259.03 498.56 259.06 491.66 252.2L363.02 124.36C356.12 117.5 356.09 106.35 362.95 99.45L362.95 99.45C369.8 92.55 380.95 92.52 387.85 99.38L516.49 227.22C523.39 234.08 523.43 245.23 516.57 252.13Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function LockIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // The actual content of the icon is much smaller than the original viewBox
  // New width is approximately 370 units (from paths analysis)
  // New height is approximately 390 units (from paths analysis)
  const scale = size / 370; // Using new width for scaling
  const height = Math.round(390 * scale); // Using new height for scaling

  return (
    <Svg
      width={size}
      height={height}
      viewBox="335 350 500 520"
      fill="none"
      {...props}
    >
      {/* Letter 'n' shape (converted from text) */}
      <Path
        d="M521.31675 364.90771q46.06104 0 74.10938 25.21778 28.04834 24.96045 28.04834 80.28515V658h-78.48389V489.96729q0-30.87891-11.32226-46.57569-11.06495-15.69678-34.9961-15.69678-36.02539 0-49.14892 24.4458-13.12354 24.4458-13.12354 70.50683V658h-78.483885V370.31152h59.956545l10.55029 36.79737h4.37451q9.26367-14.92481 22.90186-24.18848 13.89551-9.26367 30.62158-13.63818 16.9834-4.37452 34.99609-4.37452z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Lock body shape */}
      <Path
        d="M489.88 608.419c-19.322 0-34.982 14.172-34.982 31.655 0 6.556 2.202 12.647 5.974 17.699l3.827 4.199-5.648 29.97h0.104l-0.906 4.806 0.681 3.378c1.639 3.88 5.476 6.603 9.947 6.603h41.993c4.48 0 8.31-2.723 9.95-6.603l0.79-3.911-1.34-7.109-0.14-0.214-5.08-26.92 3.83-4.199c3.77-5.052 5.97-11.143 5.97-17.699 0-17.483-15.66-31.655-34.97-31.655zM345.529 552h288.941c4.71 0 8.53 3.825 8.53 8.542v211.916c0 4.718-3.82 8.542-8.53 8.542H345.529c-4.71 0-8.529-3.824-8.529-8.542V560.542c0-4.717 3.819-8.542 8.529-8.542z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function UnlockIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // The actual content of the icon fits in a smaller space
  const scale = size / 370; // Using optimized width
  const height = Math.round(390 * scale); // Using optimized height

  return (
    <Svg
      width={size}
      height={height}
      viewBox="340 1290 500 520"
      fill="none"
      {...props}
    >
      {/* Modified 'n' shape (rotated and cut) */}
      <Path
        d="M226.47754 -291.51602c-6.9263-1.05074-14.22813-1.57553-21.90496-1.57553-12.00845 0-23.6731 1.45751-34.99536 4.37385-11.1507 2.91634-21.35912 7.46223-30.62278 13.638-9.09212 6.17577-16.72488 14.23865-22.90066 24.18851l-4.37491 0.0008-10.5508-36.79839-59.956692-0.00013L41.172362-0.00000879 119.65567 0.00025l-0.00065-135.35371c0-30.70732 4.37536-54.20967 13.12438-70.50686 8.74901-16.29719 25.1322-24.44438 49.14911-24.44438 15.95408 0 27.61892 5.23154 34.99555 15.69605 7.54816 10.46451 11.32354 25.98951 11.32354 46.57543l-0.00034 68.988798 78.48376-0.633873-0.00007-87.910705c0-36.88309-9.34976-63.64563-28.04863-80.28592-14.02416-12.60887-31.42587-20.48888-52.20478-23.6411z"
        fill={color}
        transform="rotate(-8.720178 10933.007 -1604.142)"
      />

      {/* Lock body */}
      <Path
        d="M523.875 1629.42c-19.317 0-34.977 14.17-34.977 31.65 0 6.56 2.202 12.65 5.974 17.7l3.827 4.2-5.648 29.97h0.104l-0.906 4.81 0.681 3.38c1.639 3.88 5.475 6.6 9.947 6.6h41.997c4.471 0 8.308-2.72 9.947-6.6l0.788-3.92-1.339-7.1-0.145-0.22-5.074-26.92 3.828-4.2c3.772-5.05 5.974-11.14 5.974-17.7 0-17.48-15.66-31.65-34.978-31.65zM379.529 1573h288.942c4.71 0 8.529 3.82 8.529 8.54v211.92c0 4.72-3.819 8.54-8.529 8.54H379.529c-4.71 0-8.529-3.82-8.529-8.54v-211.92c0-4.72 3.819-8.54 8.529-8.54z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function SettingsIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 565; // 565 is original width
  const height = Math.round(566 * scale); // 566 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (1965, 1296)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 565 566"
      fill="none"
      {...props}
    >
      {/* Inner circle */}
      <Path
        d="M179.5 283C179.5 225.84 225.61 179.5 282.5 179.5C339.39 179.5 385.5 225.84 385.5 283C385.5 340.16 339.39 386.5 282.5 386.5C225.61 386.5 179.5 340.16 179.5 283Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Outer gear shape */}
      <Path
        d="M282.5 11.5C291.85 11.5 301.1 11.97 310.21 12.9L326.66 15.42L352 63.65L372.49 70.01L388.34 78.61L439.77 62.62L474.13 91.02L502.47 125.44L486.62 176.63L495.51 193.02L501.91 213.62L549.59 238.76L552.1 255.24C553.03 264.37 553.5 273.63 553.5 283C553.5 292.37 553.03 301.63 552.1 310.76L549.59 327.24L501.91 352.38L495.51 372.98L486.62 389.37L502.47 440.56L474.13 474.98L439.77 503.38L388.34 487.39L372.49 495.99L352 502.35L326.66 550.58L310.21 553.1C301.1 554.03 291.85 554.5 282.5 554.5C273.15 554.5 263.9 554.03 254.79 553.1L238.34 550.58L213 502.35L192.51 495.99L176.66 487.39L125.23 503.38L90.87 474.98L62.53 440.56L78.39 389.37L69.49 372.98L63.09 352.38L15.41 327.24L12.9 310.76C11.97 301.63 11.5 292.37 11.5 283C11.5 273.63 11.97 264.37 12.9 255.24L15.41 238.76L63.09 213.62L69.49 193.02L78.39 176.63L62.53 125.44L90.87 91.02L125.23 62.62L176.66 78.61L192.51 70.01L213 63.65L238.34 15.42L254.79 12.9C263.9 11.97 273.15 11.5 282.5 11.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function UserIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 450; // 450 is original width
  const height = Math.round(591 * scale); // 591 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (463, 1260)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 450 591"
      fill="none"
      {...props}
    >
      {/* Head circle */}
      <Path
        d="M117.5 119.5C117.5 59.85 165.629 11.5 225 11.5C284.371 11.5 332.5 59.85 332.5 119.5C332.5 179.15 284.371 227.5 225 227.5C165.629 227.5 117.5 179.15 117.5 119.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Body shape */}
      <Path
        d="M225 272.5C318.84 272.5 399.355 336.9 433.747 428.67L438.5 445.95L438.5 545.18C438.5 564.13 423.128 579.5 404.165 579.5L45.835 579.5C26.872 579.5 11.5 564.13 11.5 545.18L11.5 445.96L16.254 428.67C50.646 336.9 131.161 272.5 225 272.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function WriteIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 573; // 573 is original width
  const height = Math.round(561 * scale); // 561 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (1140, 1275)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 573 561"
      fill="none"
      {...props}
    >
      {/* Base square/document shape */}
      <Path
        d="M62.66 88.5L409.25 88.5L266.47 231.15C255.9 241.71 250.62 255.55 250.63 269.38L251.14 271.99L234.56 339.07L300.92 322.64L304.84 323.4C318.71 323.39 332.57 318.11 343.14 307.54L488.5 162.32L488.5 498.46C488.5 526.65 465.6 549.5 437.34 549.5L62.66 549.5C34.4 549.5 11.5 526.65 11.5 498.46L11.5 139.54C11.5 111.35 34.4 88.5 62.66 88.5Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Pencil shape */}
      <Path
        d="M507.06 11.83C520.91 11.82 534.76 17.1 545.33 27.65L545.33 27.65C566.47 48.77 566.49 83.02 545.38 104.16L342.51 307.3C331.95 317.87 318.11 323.16 304.27 323.17L300.35 322.42L234.09 338.85L250.64 271.72L250.14 269.11C250.13 255.27 255.4 241.42 265.95 230.85L468.82 27.71C479.38 17.13 493.22 11.84 507.06 11.83Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
        fillRule="evenodd"
      />

      {/* Horizontal mark in square */}
      <Path
        d="M102 471.5C102 460.73 110.73 452 121.5 452L409.5 452C420.27 452 429 460.73 429 471.5L429 471.5C429 482.27 420.27 491 409.5 491L121.5 491C110.73 491 102 482.27 102 471.5Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Vertical mark in square */}
      <Path
        d="M409.5 393C420.27 393 429 401.73 429 412.5L429 471.5C429 482.27 420.27 491 409.5 491L409.5 491C398.73 491 390 482.27 390 471.5L390 412.5C390 401.73 398.73 393 409.5 393Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function ArrowRightIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 185; // 185 is original width
  const height = Math.round(332 * scale); // 332 is original height

  // Transform coordinates to remove the translation
  // Original paths were translated by (2131, 1386)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 185 332"
      fill="none"
      {...props}
    >
      {/* Bottom diagonal line */}
      <Path
        d="M6.49 325.49C-1.25 317.8 -1.29 305.28 6.41 297.54L149.89 153.16C157.59 145.42 170.1 145.38 177.85 153.07L177.85 153.07C185.59 160.77 185.63 173.28 177.93 181.03L34.44 325.41C26.75 333.15 14.23 333.19 6.49 325.49Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Top diagonal line */}
      <Path
        d="M178.83 177.81C171.13 185.55 158.62 185.59 150.87 177.9L6.49 34.41C-1.25 26.72 -1.29 14.2 6.41 6.46L6.41 6.46C14.1 -1.29 26.62 -1.32 34.36 6.37L178.74 149.86C186.48 157.55 186.52 170.07 178.83 177.81Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function PlusIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 243; // 243 is original width
  const height = Math.round(243 * scale); // 243 is original height (perfect square)

  // Transform coordinates to remove the translation and clip
  // Original paths were translated by (3439, 759)
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 243 243"
      fill="none"
      {...props}
    >
      {/* Horizontal rectangle */}
      <Path
        d="M0 121C0 109.954 8.95 101 20 101L223 101C234.05 101 243 109.954 243 121L243 121C243 132.046 234.05 141 223 141L20 141C8.95 141 0 132.046 0 121Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Vertical rectangle */}
      <Path
        d="M121 243C109.95 243 101 234.046 101 223L101 20C101 8.954 109.95 0 121 0L121 0C132.05 0 141 8.954 141 20L141 223C141 234.046 132.05 243 121 243Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function UncheckedBoxIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 273; // 273 is original width
  const height = Math.round(274 * scale); // 274 is original height

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 273 274"
      fill="none"
      {...props}
    >
      {/* Empty square with rounded corners */}
      <Path
        d="M11.5 53.17C11.5 30.16 30.16 11.5 53.17 11.5L219.83 11.5C242.84 11.5 261.5 30.16 261.5 53.17L261.5 220.83C261.5 243.84 242.84 262.5 219.83 262.5L53.17 262.5C30.16 262.5 11.5 243.84 11.5 220.83Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function CheckedBoxIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  // Calculate scale factor to fit original SVG proportions into desired size
  const scale = size / 273; // 273 is original width
  const height = Math.round(273 * scale); // 273 is original height (perfect square)

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 273 273"
      fill="none"
      {...props}
    >
      {/* Square with rounded corners */}
      <Path
        d="M11.5 53.17C11.5 30.16 30.16 11.5 53.17 11.5L219.83 11.5C242.84 11.5 261.5 30.16 261.5 53.17L261.5 219.83C261.5 242.84 242.84 261.5 219.83 261.5L53.17 261.5C30.16 261.5 11.5 242.84 11.5 219.83Z"
        stroke={color}
        strokeWidth="22.9167"
        strokeMiterlimit="8"
        fill="none"
        fillRule="evenodd"
      />

      {/* Checkmark - long diagonal */}
      <Path
        d="M93.15 212.65C86.25 205.8 86.21 194.65 93.07 187.75L220.92 59.11C227.77 52.21 238.92 52.17 245.82 59.03L245.82 59.03C252.72 65.88 252.75 77.03 245.9 83.93L118.05 212.58C111.2 219.47 100.04 219.51 93.15 212.65Z"
        fill={color}
        fillRule="evenodd"
      />

      {/* Checkmark - short diagonal */}
      <Path
        d="M28.17 124.97C34.91 118.18 45.89 118.15 52.68 124.89L116.44 188.27C123.23 195.01 123.27 205.99 116.52 212.78L116.52 212.78C109.77 219.56 98.8 219.6 92.01 212.85L28.24 149.48C21.45 142.73 21.42 131.76 28.17 124.97Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function ChevronDownIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M6.343 7.757L12 13.414l5.657-5.657a1 1 0 011.414 1.414l-6.364 6.364a1 1 0 01-1.414 0L5.93 9.172a1 1 0 011.414-1.415z"
        fill={color}
      />
    </Svg>
  );
}

export function ChevronUpIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M17.657 16.243L12 10.586l-5.657 5.657a1 1 0 01-1.414-1.414l6.364-6.364a1 1 0 011.414 0l6.364 6.364a1 1 0 01-1.414 1.414z"
        fill={color}
      />
    </Svg>
  );
}

export function MailIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
        fill={color}
      />
    </Svg>
  );
}

export function LinkedinIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z"
        fill={color}
      />
    </Svg>
  );
}

export function MessageIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
        fill={color}
      />
    </Svg>
  );
}

export function InstagramIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
        fill={color}
      />
    </Svg>
  );
}

export function ArrowLeftIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  const scale = size / 185;
  const height = Math.round(332 * scale);

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 185 332"
      fill="none"
      {...props}
    >
      {/* Same paths as ArrowRight but with transformed coordinates to point left */}
      <Path
        d="M178.51 325.49C186.25 317.8 186.29 305.28 178.59 297.54L35.11 153.16C27.41 145.42 14.9 145.38 7.15 153.07L7.15 153.07C-0.59 160.77 -0.63 173.28 7.07 181.03L150.56 325.41C158.25 333.15 170.77 333.19 178.51 325.49Z"
        fill={color}
        fillRule="evenodd"
      />
      <Path
        d="M6.17 177.81C13.87 185.55 26.38 185.59 34.13 177.9L178.51 34.41C186.25 26.72 186.29 14.2 178.59 6.46L178.59 6.46C170.9 -1.29 158.38 -1.32 150.64 6.37L6.26 149.86C-1.48 157.55 -1.52 170.07 6.17 177.81Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function ProgressDotEmpty({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  const theme = useTheme();
  // Convert color to string before checking
  const colorStr = String(color);
  const strokeColor = colorStr.startsWith("$")
    ? theme[colorStr.substring(1)]?.val ?? color
    : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle
        cx={12}
        cy={12}
        r={8}
        stroke={strokeColor}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

export function ProgressDotFilled({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  const theme = useTheme();
  // Convert color to string before checking
  const colorStr = String(color);
  const fillColor = colorStr.startsWith("$")
    ? theme[colorStr.substring(1)]?.val ?? color
    : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={12} cy={12} r={8} fill={fillColor} />
    </Svg>
  );
}

export const ImportIcon = ({ size = 24, color = "black" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 16L12 8M12 8L9 11M12 8L15 11"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export function LinkIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M10 13.2C10.5 13.8 11.2 14.1 12 14.1C12.8 14.1 13.5 13.8 14 13.2L17.3 9.9C18.5 8.7 18.5 6.8 17.3 5.6C16.1 4.4 14.2 4.4 13 5.6L12.5 6.1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 10.8C13.5 10.2 12.8 9.9 12 9.9C11.2 9.9 10.5 10.2 10 10.8L6.7 14.1C5.5 15.3 5.5 17.2 6.7 18.4C7.9 19.6 9.8 19.6 11 18.4L11.5 17.9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PencilIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M15.4 5.4L18.6 8.6M3 21H6.2L19.8 7.4C20.5333 6.66667 20.5333 5.46667 19.8 4.73333L19.2667 4.2C18.5333 3.46667 17.3333 3.46667 16.6 4.2L3 17.8V21Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ArrowDownIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  const scale = size / 332;
  const height = Math.round(185 * scale);

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 332 185"
      fill="none"
      {...props}
    >
      <Path
        d="M6.37 6.286C14.06-1.457 26.58-1.496 34.32 6.199L178.7 149.687C186.44 157.382 186.48 169.897 178.79 177.64L178.79 177.64C171.09 185.383 158.58 185.422 150.83 177.727L6.45 34.239C-1.29 26.544-1.33 14.029 6.37 6.286Z"
        fill={color}
        fillRule="evenodd"
      />
      <Path
        d="M154.05 178.62C146.31 170.925 146.27 158.411 153.96 150.668L297.45 6.286C305.15-1.456 317.66-1.495 325.4 6.2L325.4 6.2C333.15 13.895 333.18 26.41 325.49 34.153L182 178.533C174.31 186.276 161.79 186.315 154.05 178.62Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function ArrowUpIcon({
  color = "#0F9ED5",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  const scale = size / 331;
  const height = Math.round(185 * scale);

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 331 185"
      fill="none"
      {...props}
    >
      <Path
        d="M325.15 178.286C317.46 186.029 304.94 186.068 297.2 178.373L152.82 34.885C145.07 27.19 145.03 14.675 152.73 6.932L152.73 6.932C160.42-0.811 172.94-0.849 180.68 6.845L325.06 150.333C332.81 158.028 332.84 170.543 325.15 178.286Z"
        fill={color}
        fillRule="evenodd"
      />
      <Path
        d="M177.47 5.952C185.21 13.647 185.25 26.162 177.55 33.904L34.07 178.286C26.37 186.029 13.86 186.067 6.11 178.372L6.11 178.372C-1.63 170.677-1.67 158.162 6.03 150.419L149.52 6.039C157.21-1.704 169.73-1.743 177.47 5.952Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

const Icons = {
  Classes: ClassesIcon,
  Tasks: TasksIcon,
  Groups: GroupsIcon,
  Menu: MenuIcon,
  Search: SearchIcon,
  Microphone: MicrophoneIcon,
  Check: CheckIcon,
  X: XIcon,
  Event: EventIcon,
  Clock: ClockIcon,
  Location: LocationIcon,
  UserCheck: UserCheckIcon,
  UserX: UserXIcon,
  Lock: LockIcon,
  Unlock: UnlockIcon,
  Settings: SettingsIcon,
  User: UserIcon,
  Write: WriteIcon,
  Plus: PlusIcon,
  ArrowRight: ArrowRightIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowDown: ArrowDownIcon,
  ArrowUp: ArrowUpIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  Mail: MailIcon,
  Linkedin: LinkedinIcon,
  Message: MessageIcon,
  Instagram: InstagramIcon,
  ProgressDotEmpty: ProgressDotEmpty,
  ProgressDotFilled: ProgressDotFilled,
  Import: ImportIcon,
  Link: LinkIcon,
  Pencil: PencilIcon,
  UncheckedBox: UncheckedBoxIcon,
  CheckedBox: CheckedBoxIcon,
};

export default Icons;
