import { Navigation } from "@/components/Navigation";
import { useSettings } from "@/contexts/SettingsContext";

const About = () => {
  const { darkMode } = useSettings();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                About FloFrame
              </h1>
              <p className="text-xl text-muted-foreground">
                Extract perfect frames from your videos in seconds
              </p>
            </div>

            <div className="space-y-6 text-foreground">
              <section className="space-y-3">
                <h2 className="text-2xl font-semibold">What is FloFrame?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FloFrame is a powerful yet simple tool for extracting
                  high-quality frames from video files. Whether you're a content
                  creator, designer, or just need a perfect screenshot from a
                  video, FloFrame makes it effortless.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold">Features</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Extract the last frame from MP4 and MOV videos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Full-quality PNG output with no compression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Drag & drop interface for quick uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Instant download of extracted frames</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold">How to Use</h2>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-semibold">1.</span>
                    <span>Upload your video file (MP4 or MOV, max 500MB)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-semibold">2.</span>
                    <span>Click "Extract Frame" to process your video</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-semibold">3.</span>
                    <span>Preview the extracted frame</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-semibold">4.</span>
                    <span>Download your high-quality PNG</span>
                  </li>
                </ol>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
