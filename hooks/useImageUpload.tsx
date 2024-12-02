import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StorageUploadResult } from "@/convex/types";

type ImageConfig = {
  aspect: [number, number];
  width: number;
  height: number;
};

export const useImageUpload = (config: ImageConfig) => {
  const generateUploadUrl = useMutation(api.mutations.generateUploadUrl);

  const uploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      throw new Error("Permission to access camera roll is required!");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: config.aspect,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: config.width, height: config.height } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const postUrl = await generateUploadUrl();
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      const uploadResult = await fetch(postUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      return (await uploadResult.json()) as StorageUploadResult;
    }
    return null;
  };

  return { uploadImage };
};
