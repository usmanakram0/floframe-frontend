import { useState, useCallback } from "react";
import { Upload as UploadIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { useUpload } from "@/contexts/UploadContext";
import { useSettings } from "@/contexts/SettingsContext";

const Upload = () => {
  const {
    videoFile,
    setVideoFile,
    videoInfo,
    setVideoInfo,
    extractedFrame,
    setExtractedFrame,
  } = useUpload();
  const { darkMode } = useSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ["video/mp4", "video/quicktime"];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4 or MOV file",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 500MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getVideoInfo = (
    file: File
  ): Promise<{ duration: number, resolution: string }> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        const resolution = `${video.videoWidth}x${video.videoHeight}`;
        resolve({ duration, resolution });
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    setVideoFile(file);
    const info = await getVideoInfo(file);
    setVideoInfo(info);
    setExtractedFrame(null);

    toast({
      title: "Video uploaded",
      description: `Duration: ${info.duration}s, Resolution: ${info.resolution}`,
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const extractFrame = async () => {
    if (!videoFile) return;

    setIsProcessing(true);

    try {
      // Create video element to extract frame
      const video = document.createElement("video");
      video.preload = "metadata";

      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
        video.src = URL.createObjectURL(videoFile);
      });

      // Seek to last frame
      video.currentTime = video.duration - 0.1;

      await new Promise((resolve) => {
        video.onseeked = resolve;
      });

      // Create canvas and extract frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);

      const frameData = canvas.toDataURL("image/png", 1.0);
      setExtractedFrame(frameData);

      URL.revokeObjectURL(video.src);

      toast({
        title: "Frame extracted",
        description: "Last frame extracted successfully",
      });
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: "Failed to extract frame from video",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFrame = () => {
    if (!extractedFrame) return;

    const link = document.createElement("a");
    link.download = `floframe-${Date.now()}.png`;
    link.href = extractedFrame;
    link.click();

    toast({
      title: "Downloaded",
      description: "Frame saved as PNG",
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main
          className={`container mx-auto px-4 py-12 max-w-4xl transition-all duration-300 ${
            !videoFile ? "flex items-center justify-center" : ""
          }`}
          style={{
            minHeight: !videoFile ? "calc(100vh - 80px)" : undefined, // assuming header is 64px tall
          }}>
          <div className="space-y-8 ">
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 
                transition-all duration-300
                ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-upload-border bg-upload-bg hover:border-upload-border/50"
                }
              `}>
              {videoFile && (
                <Button
                  onClick={() => {
                    setVideoFile(null);
                    setExtractedFrame(null);
                    setVideoInfo(null);
                  }}
                  disabled={isProcessing}
                  className="absolute top-[16px] right-[16px] z-50 text-lg rounded-[6px] font-semibold bg-red-500 hover:bg-red-600 text-white">
                  Clear
                </Button>
              )}

              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <UploadIcon className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground break-all">
                    {videoFile ? videoFile.name : "Upload Video"}
                  </h2>
                  <p className="text-muted-foreground">
                    Drag & drop or click to browse • MP4 or MOV • Max 500MB
                  </p>
                </div>

                {videoInfo && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Duration: {videoInfo.duration} seconds</p>
                    <p>Resolution: {videoInfo.resolution}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Extract Button */}
            {videoFile && !extractedFrame && (
              <div className="flex items-center gap-10">
                <Button
                  onClick={extractFrame}
                  disabled={isProcessing}
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90">
                  {isProcessing ? "Processing..." : "Extract Frame"}
                </Button>
              </div>
            )}

            {/* Preview & Download */}
            {extractedFrame && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden border border-border bg-card">
                  <img
                    src={extractedFrame}
                    alt="Extracted frame"
                    className="w-full h-auto"
                  />
                </div>

                <Button
                  onClick={downloadFrame}
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90">
                  <Download className="w-5 h-5 mr-2" />
                  Download PNG
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
