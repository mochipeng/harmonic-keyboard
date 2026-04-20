import { FC, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { initAudio, playChord } from "@/lib/audio";
import { ChordQuality } from "@shared/schema";
import { generateVoicing } from "@/lib/voiceLeading";

interface ChordDef {
  root: number; // 0-11, C=0, C#=1, etc.
  quality: ChordQuality;
  bass: number; // MIDI note number
  name: string;
}

interface Progression {
  name: string;
  chords: ChordDef[];
  tempo: number; // ms between chords
}

const progressions: Progression[] = [
  {
    name: "ii-V-I",
    tempo: 800,
    chords: [
      { root: 2, quality: ChordQuality.Minor7, bass: 50, name: "Dm7" },   // Dm7
      { root: 7, quality: ChordQuality.Dominant7, bass: 55, name: "G7" },  // G7
      { root: 0, quality: ChordQuality.Major7, bass: 48, name: "Cmaj7" }, // Cmaj7
    ],
  },
  {
    name: "I-vi-IV-V",
    tempo: 700,
    chords: [
      { root: 0, quality: ChordQuality.Major, bass: 48, name: "C" },    // C
      { root: 9, quality: ChordQuality.Minor, bass: 57, name: "Am" },  // Am
      { root: 5, quality: ChordQuality.Major, bass: 53, name: "F" },    // F
      { root: 7, quality: ChordQuality.Major, bass: 55, name: "G" },    // G
    ],
  },
  {
    name: "12-Bar Blues",
    tempo: 600,
    chords: [
      // Bars 1-4: I
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      // Bars 5-6: IV
      { root: 5, quality: ChordQuality.Dominant7, bass: 53, name: "F7" },
      { root: 5, quality: ChordQuality.Dominant7, bass: 53, name: "F7" },
      // Bars 7-8: I
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      // Bar 9: V
      { root: 7, quality: ChordQuality.Dominant7, bass: 55, name: "G7" },
      // Bar 10: IV
      { root: 5, quality: ChordQuality.Dominant7, bass: 53, name: "F7" },
      // Bars 11-12: I-V
      { root: 0, quality: ChordQuality.Dominant7, bass: 48, name: "C7" },
      { root: 7, quality: ChordQuality.Dominant7, bass: 55, name: "G7" },
    ],
  },
  {
    name: "Circle of 5ths",
    tempo: 750,
    chords: [
      { root: 0, quality: ChordQuality.Major7, bass: 48, name: "Cmaj7" },  // C
      { root: 7, quality: ChordQuality.Major7, bass: 55, name: "Gmaj7" }, // G
      { root: 2, quality: ChordQuality.Major7, bass: 50, name: "Dmaj7" }, // D
      { root: 9, quality: ChordQuality.Major7, bass: 57, name: "Amaj7" }, // A
      { root: 4, quality: ChordQuality.Major7, bass: 52, name: "Emaj7" }, // E
      { root: 11, quality: ChordQuality.Major7, bass: 59, name: "Bmaj7" }, // B
      { root: 6, quality: ChordQuality.Major7, bass: 54, name: "F#maj7" }, // F#
      { root: 1, quality: ChordQuality.Major7, bass: 49, name: "C#maj7" }, // C#
    ],
  },
];

interface ChordPresetsProps {
  className?: string;
}

const ChordPresets: FC<ChordPresetsProps> = ({ className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgression, setCurrentProgression] = useState<string | null>(null);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const playProgression = useCallback(async (progression: Progression) => {
    if (isPlaying) return;

    // Initialize audio if needed
    await initAudio();

    setIsPlaying(true);
    setCurrentProgression(progression.name);
    setCurrentChordIndex(0);

    let prevVoicing = null;

    for (let i = 0; i < progression.chords.length; i++) {
      setCurrentChordIndex(i);
      const chord = progression.chords[i];

      // Create voicing for this chord
      const basicVoicing = {
        root: chord.root,
        bass: chord.bass,
        quality: chord.quality,
        position: 0 as const, // root position
        notes: [],
      };

      const fullVoicing = generateVoicing(basicVoicing, prevVoicing);
      prevVoicing = fullVoicing;

      // Play the chord
      playChord(fullVoicing);

      // Wait for tempo duration
      await new Promise((resolve) => setTimeout(resolve, progression.tempo));
    }

    // Release all notes at the end
    playChord(null);
    setIsPlaying(false);
    setCurrentProgression(null);
    setCurrentChordIndex(0);
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    playChord(null, true);
    setIsPlaying(false);
    setCurrentProgression(null);
    setCurrentChordIndex(0);
  }, []);

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-2 justify-center">
        {progressions.map((progression) => (
          <Button
            key={progression.name}
            onClick={() => playProgression(progression)}
            disabled={isPlaying}
            variant={currentProgression === progression.name ? "default" : "outline"}
            size="sm"
            className={`
              ${currentProgression === progression.name ? "bg-blue-500 hover:bg-blue-600" : ""}
              transition-all duration-200
            `}
          >
            {currentProgression === progression.name ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">♪</span>
                {progression.name} ({currentChordIndex + 1}/{progression.chords.length})
              </span>
            ) : (
              progression.name
            )}
          </Button>
        ))}
        {isPlaying && (
          <Button
            onClick={stopPlayback}
            variant="destructive"
            size="sm"
          >
            Stop
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChordPresets;
