import { FC, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { initAudio, playChord } from "@/lib/audio";
import { ChordQuality, ChordPosition, type ChordVoicing } from "@shared/schema";
import { generateVoicing } from "@/lib/voiceLeading";

interface ChordDef {
  root: number;
  quality: ChordQuality;
  bass: number;
  name: string;
}

interface Progression {
  name: string;
  chords: ChordDef[];
  tempo: number;
}

// Jazz-focused progressions
const progressions: Progression[] = [
  {
    name: "ii-V-I",
    tempo: 1000,
    chords: [
      { root: 2, quality: ChordQuality.Minor7, bass: 50, name: "Dm7" },
      { root: 7, quality: ChordQuality.Dominant7, bass: 55, name: "G7" },
      { root: 0, quality: ChordQuality.Major7, bass: 48, name: "Cmaj7" },
    ],
  },
  {
    name: "I-vi-ii-V",
    tempo: 900,
    chords: [
      { root: 0, quality: ChordQuality.Major7, bass: 48, name: "Cmaj7" },
      { root: 9, quality: ChordQuality.Minor7, bass: 57, name: "Am7" },
      { root: 2, quality: ChordQuality.Minor7, bass: 50, name: "Dm7" },
      { root: 7, quality: ChordQuality.Dominant7, bass: 55, name: "G7" },
    ],
  },
  {
    name: "Autumn Leaves",
    tempo: 1100,
    chords: [
      { root: 2, quality: ChordQuality.Minor7, bass: 50, name: "Dm7" },
      { root: 7, quality: ChordQuality.Dominant7, bass: 55, name: "G7" },
      { root: 0, quality: ChordQuality.Major7, bass: 48, name: "Cmaj7" },
      { root: 5, quality: ChordQuality.Major7, bass: 53, name: "Fmaj7" },
      { root: 0, quality: ChordQuality.Minor7, bass: 48, name: "Cm7" },
      { root: 7, quality: ChordQuality.HalfDiminished7, bass: 55, name: "Bm7b5" },
      { root: 0, quality: ChordQuality.Major7, bass: 48, name: "Cmaj7" },
    ],
  },
  {
    name: "Blue Bossa",
    tempo: 1100,
    chords: [
      { root: 0, quality: ChordQuality.Minor7, bass: 48, name: "Cm7" },
      { root: 0, quality: ChordQuality.Minor7, bass: 48, name: "Cm7" },
      { root: 7, quality: ChordQuality.HalfDiminished7, bass: 55, name: "Bm7b5" },
      { root: 10, quality: ChordQuality.Dominant7, bass: 58, name: "Eb7" },
      { root: 5, quality: ChordQuality.Minor7, bass: 53, name: "Fm7" },
      { root: 5, quality: ChordQuality.Minor7, bass: 53, name: "Fm7" },
      { root: 0, quality: ChordQuality.Minor7, bass: 48, name: "Cm7" },
      { root: 9, quality: ChordQuality.Minor7, bass: 57, name: "Am7b5" },
    ],
  },
  {
    name: "Soulful",
    tempo: 1100,
    chords: [
      { root: 5, quality: ChordQuality.Major7, bass: 53, name: "Fmaj7" },   // Fmaj7
      { root: 7, quality: ChordQuality.Minor7, bass: 55, name: "Gm7" },     // Gm7
      { root: 9, quality: ChordQuality.Minor7, bass: 57, name: "Am7" },     // Am7
      { root: 10, quality: ChordQuality.Major7, bass: 58, name: "B♭maj7" },  // B♭maj7
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
  const abortRef = useRef<boolean>(false);

  const stopPlayback = useCallback(() => {
    abortRef.current = true;
    playChord(null, true);
    setIsPlaying(false);
    setCurrentProgression(null);
    setCurrentChordIndex(0);
  }, []);

  const playProgression = useCallback(async (progression: Progression) => {
    if (isPlaying) {
      stopPlayback();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    abortRef.current = false;
    await initAudio();

    setIsPlaying(true);
    setCurrentProgression(progression.name);
    setCurrentChordIndex(0);

    let prevVoicing: ChordVoicing | null = null;

    for (let i = 0; i < progression.chords.length; i++) {
      if (abortRef.current) break;

      setCurrentChordIndex(i);
      const chord = progression.chords[i];

      const basicVoicing: ChordVoicing = {
        root: chord.root,
        bass: chord.bass,
        quality: chord.quality,
        position: ChordPosition.Root,
        notes: [],
      };

      const fullVoicing = generateVoicing(basicVoicing, prevVoicing);
      prevVoicing = fullVoicing;

      playChord(fullVoicing);

      await new Promise(resolve => setTimeout(resolve, progression.tempo));
    }

    if (!abortRef.current) {
      playChord(null);
    }
    setIsPlaying(false);
    setCurrentProgression(null);
    setCurrentChordIndex(0);
    abortRef.current = false;
  }, [isPlaying, stopPlayback]);

  return (
    <div className={`${className}`}>
      <div className="text-xs text-gray-500 text-center mb-2">Jazz Progressions</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {progressions.map((progression) => (
          <Button
            key={progression.name}
            onClick={() => playProgression(progression)}
            disabled={isPlaying && currentProgression !== progression.name}
            variant={currentProgression === progression.name ? "default" : "outline"}
            size="sm"
            className={`
              ${currentProgression === progression.name ? "bg-blue-500 hover:bg-blue-600" : ""}
              transition-all duration-200
            `}
          >
            {currentProgression === progression.name ? (
              <span className="flex items-center gap-1">
                <span className="animate-pulse">♫</span>
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
