// import {
//   Button as TamaguiButton,
//   styled,
//   GetProps,
//   ButtonProps,
// } from "tamagui";

// // Create styled variant of Tamagui button
// export const CustomButton = styled(TamaguiButton, {
//   name: "Button",
//   backgroundColor: "$primary" as const, // Type assertion
//   borderRadius: "$2",
//   paddingVertical: "$3",
//   paddingHorizontal: "$4",

//   variants: {
//     variant: {
//       primary: {
//         backgroundColor: "$primary" as const,
//         color: "white" as const,
//       },
//       secondary: {
//         backgroundColor: "$secondary" as const,
//         color: "white" as const,
//       },
//       outline: {
//         backgroundColor: "transparent" as const,
//         borderWidth: 2,
//         borderColor: "$primary" as const,
//         color: "$primary" as const,
//       },
//     },
//     size: {
//       small: {
//         paddingVertical: "$2",
//         paddingHorizontal: "$3",
//         fontSize: "$3",
//       },
//       medium: {
//         paddingVertical: "$3",
//         paddingHorizontal: "$4",
//         fontSize: "$4",
//       },
//       large: {
//         paddingVertical: "$4",
//         paddingHorizontal: "$5",
//         fontSize: "$5",
//       },
//     },
//   },

//   defaultVariants: {
//     variant: "primary",
//     size: "medium",
//   },

//   pressStyle: {
//     opacity: 0.8,
//   },
// });

// export type CustomButtonProps = GetProps<typeof CustomButton>;
