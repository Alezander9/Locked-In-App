import { XStack } from "tamagui";
import { TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "@/app/components/icons";
import { useRouter } from "expo-router";
import Icons from "@/app/components/icons";
import { useTheme } from "tamagui";

type ProfileCreationHeaderProps = {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  showAddClass?: boolean;
  showImport?: boolean;
  onAddClass?: () => void;
  onImport?: () => void;
};

export function ProfileCreationHeader({
  currentStep,
  totalSteps = 7,
  onBack,
  showAddClass = false,
  showImport = false,
  onAddClass,
  onImport,
}: ProfileCreationHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    if (currentStep === 0) {
      router.replace("/(tabs)/groups");
    } else {
      onBack();
    }
  };

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      marginBottom="$2"
      width="100%"
      padding="$2"
    >
      <XStack width={40} alignItems="flex-start">
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            paddingHorizontal: 10,
          }}
        >
          <ArrowLeftIcon size={15} color={theme.primary.val} />
        </TouchableOpacity>
      </XStack>

      <XStack flex={1} justifyContent="center" alignItems="center" space="$2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <XStack key={index}>
            {index <= currentStep ? (
              <Icons.ProgressDotFilled size={12} color="$primary" />
            ) : (
              <Icons.ProgressDotEmpty size={12} color="$gray" />
            )}
          </XStack>
        ))}
      </XStack>

      <XStack width={40} alignItems="flex-end">
        {showAddClass && (
          <TouchableOpacity onPress={onAddClass}>
            <Icons.Plus size={24} color={theme.primary.val} />
          </TouchableOpacity>
        )}
        {showImport && (
          <TouchableOpacity onPress={onImport}>
            <Icons.Import size={25} color={theme.primary.val} />
          </TouchableOpacity>
        )}
      </XStack>
    </XStack>
  );
}
