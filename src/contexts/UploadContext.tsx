import { createContext, useContext, useState, ReactNode } from "react";

interface UploadContextType {
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  videoInfo: { duration: number; resolution: string } | null;
  setVideoInfo: (info: { duration: number; resolution: string } | null) => void;
  extractedFrame: string | null;
  setExtractedFrame: (frame: string | null) => void;
  uploadProgress: number | null;
  setUploadProgress: (progress: any) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoInfo, setVideoInfo] = useState<{
    duration: number;
    resolution: string;
  } | null>(null);
  const [extractedFrame, setExtractedFrame] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  return (
    <UploadContext.Provider
      value={{
        videoFile,
        setVideoFile,
        videoInfo,
        setVideoInfo,
        extractedFrame,
        setExtractedFrame,
        uploadProgress,
        setUploadProgress,
      }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};
