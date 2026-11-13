import { Stack } from "expo-router";
import NavigationMenu from "../components/NavigationMenu.js";
import { colors } from "../theme/colors.js";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.navy,
        headerTitleStyle: { color: colors.text, fontWeight: "700" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "JMT",
          headerRight: () => <NavigationMenu />,
        }}
      />
      <Stack.Screen
        name="birth-download"
        options={{ title: "Birth Certificate" }}
      />
    </Stack>
  );
}
