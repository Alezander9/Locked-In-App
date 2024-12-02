import { YStack, Image } from "tamagui";
import { TouchableOpacity } from "react-native";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Id } from "@/convex/_generated/dataModel";

type ProfileBackgroundProps = {
  backgroundImageUrl: string | null | undefined;
  onUploadSuccess: (storageId: Id<"_storage">) => Promise<unknown>; // Changed return type to be more permissive
  userId: string;
};

export function ProfileBackground({
  backgroundImageUrl,
  onUploadSuccess,
  userId,
}: ProfileBackgroundProps) {
  const { uploadImage } = useImageUpload({
    aspect: [16, 9],
    width: 1920,
    height: 1080,
  });

  const handleBackgroundUpload = async () => {
    try {
      const result = await uploadImage();
      if (result?.storageId) {
        await onUploadSuccess(result.storageId as Id<"_storage">);
      }
    } catch (error) {
      console.error("Error uploading background image:", error);
      alert("Failed to upload background image. Please try again.");
    }
  };

  return (
    <TouchableOpacity onPress={handleBackgroundUpload}>
      <YStack height={160} width="100%" overflow="hidden" borderRadius={0}>
        <Image
          source={
            backgroundImageUrl
              ? { uri: backgroundImageUrl }
              : require("@/assets/images/mountains.jpg")
          }
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 0,
          }}
          resizeMode="cover"
        />
      </YStack>
    </TouchableOpacity>
  );
}
