import { type ChordVoicing } from "@shared/schema";
import { useSettings } from "@/hooks/useSettings";

interface MainPianoDisplayProps {
  activeVoicing: ChordVoicing | null;
}

const blackKeyPositions = [
  { left: "15%", midiOffset: 1 },
  { left: "30%", midiOffset: 3 },
  { left: "58.5%", midiOffset: 6 },
  { left: "73%", midiOffset: 8 },
  { left: "87%", midiOffset: 10 },
];

const whiteKeyData = [
  { midiOffset: 0 },
  { midiOffset: 2 },
  { midiOffset: 4 },
  { midiOffset: 5 },
  { midiOffset: 7 },
  { midiOffset: 9 },
  { midiOffset: 11 },
];

// Maps note pitch class (0–11) to a hue on the color wheel
const noteHues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

function getRainbowKeyStyle(midiNote: number, isActive: boolean, isBlack: boolean) {
  const pitchClass = midiNote % 12;
  const hue = noteHues[pitchClass];
  const lightness = isBlack ? 35 : 70;
  const activeLightness = isBlack ? 55 : 85;
  return {
    backgroundColor: `hsl(${hue}, 85%, ${isActive ? activeLightness : lightness}%)`,
  };
}

export default function MainPianoDisplay({ activeVoicing }: MainPianoDisplayProps) {
  const { settings } = useSettings();
  const isRainbow = settings.colorMode === "rainbow";
  const activeNotes = new Set(activeVoicing?.notes || []);
  const isNoteActive = (midiNote: number) => activeNotes.has(midiNote);

  const octaves = [3, 4, 5];

  return (
    <div className="w-full">
      <div className="relative w-full max-w-3xl h-48 mx-auto">
        <div className="flex h-full relative">
          {octaves.map((octave) => (
            <div key={octave} className="flex-1 relative">
              {/* White Keys */}
              <div className="flex h-full">
                {whiteKeyData.map(({ midiOffset }) => {
                  const midiNote = (octave + 1) * 12 + midiOffset;
                  const active = isNoteActive(midiNote);
                  const style = isRainbow
                    ? getRainbowKeyStyle(midiNote, active, false)
                    : active
                    ? { backgroundColor: "hsl(var(--piano-active-key))" }
                    : { backgroundColor: "hsl(var(--piano-white-key))" };
                  return (
                    <div
                      key={midiNote}
                      style={style}
                      className="flex-1 flex items-end justify-center border-l last:border-r transition-colors duration-150"
                    />
                  );
                })}
              </div>

              {/* Black Keys */}
              <div className="absolute top-0 left-0 h-[65%] w-full">
                {blackKeyPositions.map(({ left, midiOffset }) => {
                  const midiNote = (octave + 1) * 12 + midiOffset;
                  const active = isNoteActive(midiNote);
                  const style = isRainbow
                    ? getRainbowKeyStyle(midiNote, active, true)
                    : active
                    ? { backgroundColor: "hsl(var(--piano-active-key))" }
                    : { backgroundColor: "hsl(var(--piano-black-key))" };
                  return (
                    <div
                      key={midiNote}
                      style={{ left, ...style }}
                      className="absolute w-[8%] h-full -ml-[4%] rounded-b-lg shadow-lg z-10 transition-colors duration-150"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
