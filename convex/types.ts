import { Id } from "./_generated/dataModel";

export interface Task {
  title: string; // maps to 'title' in AI response
  dueDate: string; // maps to 'due date' in AI response
  notes: string; // maps to 'notes' in AI response
}

export class FileProcessingError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_FILE_TYPE"
      | "FILE_TOO_LARGE"
      | "API_KEY_MISSING"
      | "UPLOAD_FAILED"
      | "PROCESSING_FAILED"
      | "EXTRACTION_FAILED"
      | "CLEANUP_FAILED"
  ) {
    super(message);
    this.name = "FileProcessingError";
  }
}

export type Class = {
  name: string;
  // Add other class properties as needed
};

export type StudyProfile = {
  _id: string;
  classes: Class[];
  dorm?: string;
  // Add other study profile properties as needed
};

export type StorageUploadResult = {
  storageId: Id<"_storage">;
};
