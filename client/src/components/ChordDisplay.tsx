import { Card } from "@/components/ui/card";
import type { ChordVoicing } from "@shared/schema";
import { midiNoteToNoteName } from "@/lib/chords";
import { getMidiNoteKey } from "@/lib/keyboardMapping";

interface ChordDisplayProps {
  voicing: ChordVoicing | null;
  sheetMusicPanelOpen: boolean;
}

export function MiniPianoGuide({ activeKey }: { activeKey?: string }) {
  return (
    <div className="flex justify-center items-center">
      <div className="relative inline-flex h-20">
        {/* White keys */}
        <div className="flex">
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => {
            const isActive = activeKey?.toLowerCase() === key.toLowerCase();
            return (
              <div
                key={key}
                className="relative w-8 h-20 border-x first:border-l last:border-r border-border flex flex-col items-center justify-end pb-1 transition-colors duration-150"
                style={{
                  backgroundColor: isActive
                    ? "hsl(var(--piano-active-key))"
                    : "hsl(var(--piano-white-key))",
                }}
              >
                <span className="text-xs font-medium text-foreground">{key}</span>
              </div>
            );
          })}
        </div>
        {/* Black keys */}
        <div className="absolute flex space-x-[1.01rem] left-[1.47rem]">
          {[
            { key: "S", skip: false },
            { key: "D", skip: false },
            { key: "", skip: true },
            { key: "G", skip: false },
            { key: "H", skip: false },
            { key: "J", skip: false },
          ].map(({ key, skip }, index) =>
            skip ? (
              <div key={index} className="w-4" />
            ) : (
              <div
                key={index}
                className="w-4 h-12 rounded-b-sm border-x border-b border-border flex flex-col items-center justify-end pb-1 transition-colors duration-150"
                style={{
                  backgroundColor:
                    activeKey?.toLowerCase() === key.toLowerCase()
                      ? "hsl(var(--piano-active-key))"
                      : "hsl(var(--piano-black-key))",
                }}
              >
                <span className="text-xs font-medium text-foreground">{key}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChordDisplay({ voicing, sheetMusicPanelOpen }: ChordDisplayProps) {
  const emptyState = !voicing;
  const activeKey = voicing ? getMidiNoteKey(voicing.bass) : undefined;

  const rootNoteName =
    voicing && voicing.root !== -1
      ? midiNoteToNoteName(voicing.root + 60).replace(/\d+/, "")
      : "";

  return (
    <div className={`flex flex-col justify-center space-y-4 ${sheetMusicPanelOpen ? "min-h-[10rem]" : ""}`}>
      <div className="text-2xl font-light text-center tracking-wide min-h-[4rem]">
        {emptyState ? (
          <span className="text-muted-foreground">Press a key to play a note</span>
        ) : (
          <>
            <span className="text-primary">{rootNoteName + " "}</span>
            <span className="text-foreground">{voicing.quality}</span>
            {voicing.position !== "root" && (
              <span className="text-muted-foreground">
                {" "}
                ({voicing.position} inversion)
              </span>
            )}
          </>
        )}
      </div>
      <MiniPianoGuide activeKey={activeKey} />
    </div>
  );
}
