import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { H2, H3 } from "tamagui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <H2>This screen doesn't exist.</H2>
      <Link href="/" style={styles.link}>
        <H3>Go to home screen!</H3>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
