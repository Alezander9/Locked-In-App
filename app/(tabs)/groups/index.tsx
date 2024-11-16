import { Button } from "@/components/CustomButton";
import { YStack, XStack, H1, H2, Separator, Theme, H3 } from "tamagui";
import { ScreenWrapper } from "@/components/ScreenWrapper";

function ButtonSet({ title }: { title: string }) {
  return (
    <>
      <H3 color="$color">{title}</H3>
      <YStack space="$4" marginBottom="$4">
        <Button size="small" label="Small" />
        <Button size="medium" label="Medium" />
        <Button size="large" label="Large" />
      </YStack>

      <YStack space="$4" marginBottom="$4">
        <Button variant="secondary" size="small" label="Small" />
        <Button variant="secondary" size="medium" label="Medium" />
        <Button variant="secondary" size="large" label="Large" />
      </YStack>

      <YStack space="$4" marginBottom="$4">
        <Button disabled size="small" label="Small" />
        <Button disabled size="medium" label="Medium" />
        <Button disabled size="large" label="Large" />
      </YStack>

      <YStack space="$4" marginBottom="$4">
        <Button width="100%" label="Primary Full Width" />
        <Button width="100%" variant="secondary" label="Secondary Full Width" />
        <Button width="100%" disabled label="Disabled Full Width" />
      </YStack>
    </>
  );
}

export default function GroupsScreen() {
  return (
    <ScreenWrapper>
      <YStack padding="$4" space="$6">
        {/* <ButtonSet title="System Theme" /> */}

        <Separator marginVertical="$4" />

        <H2 color="$color">Theme Preview</H2>

        <XStack space="$4" flexWrap="wrap">
          <Theme name="light">
            <YStack
              flex={1}
              space="$4"
              backgroundColor="$bg"
              padding="$4"
              borderRadius="$2"
            >
              <ButtonSet title="Light Theme" />
            </YStack>
          </Theme>

          <Theme name="dark">
            <YStack
              flex={1}
              space="$4"
              backgroundColor="$bg"
              padding="$4"
              borderRadius="$2"
            >
              <ButtonSet title="Dark Theme" />
            </YStack>
          </Theme>
        </XStack>
      </YStack>
    </ScreenWrapper>
  );
}
