import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen 
        name="profile/index"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: false,  // Disable gesture since we handle back in-component
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
