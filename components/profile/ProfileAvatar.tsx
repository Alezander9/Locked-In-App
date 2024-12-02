import { YStack, Image } from "tamagui";
import { TouchableOpacity } from "react-native";
import { UserIcon } from "@/app/components/icons";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useTheme } from "tamagui";
import { StorageUploadResult } from "@/convex/types";
import { Id } from "@/convex/_generated/dataModel";

type ProfileAvatarProps = {
  imageUrl: string | null | undefined;
  onUploadSuccess: (storageId: Id<"_storage">) => Promise<unknown>; // Changed return type
  userId: string;
};

export function ProfileAvatar({
  imageUrl,
  onUploadSuccess,
  userId,
}: ProfileAvatarProps) {
  const theme = useTheme();
  const { uploadImage } = useImageUpload({
    aspect: [1, 1],
    width: 1000,
    height: 1000,
  });

  const handleImageUpload = async () => {
    try {
      const result = await uploadImage();
      if (result?.storageId) {
        await onUploadSuccess(result.storageId as Id<"_storage">);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <TouchableOpacity onPress={handleImageUpload}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            borderWidth: 3,
            borderColor: theme.background.val,
          }}
        />
      ) : (
        <YStack
          width={110}
          height={110}
          borderRadius={55}
          backgroundColor="$iosGray"
          justifyContent="center"
          alignItems="center"
          borderWidth={3}
          borderColor={theme.background.val}
        >
          <UserIcon size={55} color={theme.color.val} />
        </YStack>
      )}
    </TouchableOpacity>
  );
}
