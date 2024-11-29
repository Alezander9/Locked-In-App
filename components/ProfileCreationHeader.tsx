import { XStack } from "tamagui";
import { TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "@/app/components/icons";
import { useRouter } from "expo-router";
import Icons from "@/app/components/icons";
import { Text } from "tamagui";

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
      marginBottom="$6"
      width="100%"
    >
      <XStack width={40} alignItems="flex-start">
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeftIcon size={15} />
        </TouchableOpacity>
      </XStack>

      <XStack 
        flex={1} 
        justifyContent="center"
        alignItems="center"
        space="$2"
      >
        {Array.from({length: totalSteps}, (_, index) => (
          <XStack key={index}>
            {index <= currentStep ? (
              <Icons.ProgressDotFilled 
                size={12}
                color="#0F9ED5"
              />
            ) : (
              <Icons.ProgressDotEmpty
                size={12}
                color="$gray"
              />
            )}
          </XStack>
        ))}
      </XStack>

      <XStack width={40} alignItems="flex-end">
        {showAddClass && (
          <TouchableOpacity onPress={onAddClass}>
            <Icons.Plus size={24} color="#0F9ED5" />
          </TouchableOpacity>
        )}
        {showImport && (
          <TouchableOpacity onPress={onImport}>
            <Icons.Import size={25} color="#0F9ED5" />
          </TouchableOpacity>
        )}
      </XStack>
    </XStack>
  );
}
