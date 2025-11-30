import { useState, useCallback, useEffect } from "react";
import { Upload as UploadIcon, Download, X } from "lucide-react";
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
    uploadProgress,
    setUploadProgress,
  } = useUpload();
  const { darkMode } = useSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ["video/mp4", "video/quicktime"];
    const maxSize = 200 * 1024 * 1024; // 200MB

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
        description: "Maximum file size is 200MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getVideoInfo = (
    file: File
  ): Promise<{ duration: number; resolution: string }> => {
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

    setUploadProgress(0);
    setVideoFile(file);
    const info = await getVideoInfo(file);
    setVideoInfo(info);
    setExtractedFrame(null);

    // simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 80);

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
  // locally extraction frame
  // const extractFrame = async () => {
  //   if (!videoFile) return;
  //   setIsProcessing(true);

  //   try {
  //     const video = document.createElement("video");
  //     video.preload = "metadata";

  //     await new Promise((resolve) => {
  //       video.onloadedmetadata = resolve;
  //       video.src = URL.createObjectURL(videoFile);
  //     });

  //     video.currentTime = video.duration - 0.1;
  //     await new Promise((resolve) => {
  //       video.onseeked = resolve;
  //     });

  //     const canvas = document.createElement("canvas");
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;

  //     const ctx = canvas.getContext("2d");
  //     ctx?.drawImage(video, 0, 0);

  //     const frameData = canvas.toDataURL("image/png", 1.0);

  //     setExtractedFrame(frameData);

  //     URL.revokeObjectURL(video.src);

  //     toast({
  //       title: "Frame extracted",
  //       description: "Last frame extracted successfully",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     toast({
  //       title: "Extraction failed",
  //       description: "Failed to extract frame from video",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const extractFrame = async () => {
    if (!videoFile) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await fetch(
        "http://localhost:4000/api/extract-last-frame",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract frame from server");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setExtractedFrame(url);

      toast({
        title: "Frame extracted",
        description: "Last frame extracted successfully",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Extraction failed",
        description: error.message || "Failed to extract frame from video",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFrame = async () => {
    if (!extractedFrame) return;
    try {
      const blob = await (await fetch(extractedFrame)).blob();
      const fileName = `floframe-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);

      if (isIOS && navigator.share) {
        toast({
          title: "Save to Photos",
          description: "In the next screen, tap 'Save to Photos'.",
        });

        try {
          await navigator.share({
            files: [file],
            title: "FloFrame",
            text: "Save frame to Photos",
          });
        } catch {
          const newTab = window.open();
          if (newTab) {
            newTab.document.write(
              `<img src="${extractedFrame}" style="width:100%" />`
            );
          }
        }
      } else if (isAndroid && navigator.share) {
        await navigator.share({
          files: [file],
          title: "FloFrame",
          text: "Save frame to Gallery",
        });
      } else {
        const link = document.createElement("a");
        link.href = extractedFrame;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setExtractedFrame(null);
      setVideoFile(null);
      setVideoInfo(null);
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = () => {
    setVideoFile(null);
    setExtractedFrame(null);
    setVideoInfo(null);
    setUploadProgress(0);
  };

  useEffect(() => {
    if (videoFile && uploadProgress === 100 && !extractedFrame) extractFrame();
  }, [uploadProgress, videoFile]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-6 max-w-[600px]">
          <div className="space-y-6">
            {/* Logo Header */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                  F
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
                FloFrame
              </h1>
            </div>

            {/* Clickable Upload Box */}
            <div
              className="border-2 cursor-pointer hover:border-primary transition-all ease-in-out 1s border-border bg-card rounded-2xl p-4"
              onClick={() =>
                document.getElementById("videoUploadInput")?.click()
              }>
              <h2 className="mb-0 text-xl sm:text-2xl font-bold text-center text-foreground">
                Upload Video
              </h2>
            </div>
            <input
              id="videoUploadInput"
              type="file"
              accept="video/mp4,video/quicktime"
              className="hidden"
              onChange={handleFileInput}
            />

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-border/50"
              }`}>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={!!videoFile}
              />

              <div
                className={`flex flex-row items-start justify-center text-center space-y-2  ${
                  videoFile?.name ? "break-all" : undefined
                }`}>
                <p className="text-xl sm:text-2xl text-muted-foreground m-0 ">
                  {videoFile
                    ? videoFile.name
                    : "Drop your MP4 or MOV file here"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {videoFile && uploadProgress !== 0 && (
              <div className="space-y-1">
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xl text-muted-foreground">
                  {uploadProgress}%
                </p>
              </div>
            )}

            {/* Image Preview */}
            {extractedFrame && (
              <div className="border-2 border-border bg-card p-3 rounded-2xl overflow-hidden">
                <div className="overflow-hidden flex items-center justify-center rounded-xl">
                  <img
                    src={extractedFrame}
                    alt="Extracted frame"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {videoFile && uploadProgress >= 100 && (
              <div className="space-y-4">
                {extractedFrame ? (
                  <div className="flex gap-4">
                    <Button
                      onClick={downloadFrame}
                      className="flex-1 h-16 text-xl font-bold bg-primary hover:bg-primary/90 rounded-2xl">
                      {/* <Download className="w-6 h-6 mr-2" /> */}
                      Extract Frame
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={extractFrame}
                    disabled={isProcessing}
                    className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 rounded-2xl">
                    {isProcessing ? "Processing..." : "Extract Frame"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
