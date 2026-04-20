# Demo Filming Cheatsheet — Agent Command Center

## Before You Hit Record
- [ ] Branch: `demo-filming` (already checked out)
- [ ] Server running: `npm run dev` → open `localhost:5173`
- [ ] Windsurf open on the `harmonic-keyboard` folder
- [ ] Cascade panel visible on the right
- [ ] Font size bumped up for screen legibility

---

## The 3 Prompts (copy-paste ready)

**Agent 1 — Transpose Control**
```
Add +/- transpose buttons to the Header component. Clicking + shifts all played notes up one semitone, - shifts down. Store the offset in useState in MainLayout and pass it into the audio trigger in Instrument.tsx. Show the current offset (e.g. "+2") between the buttons.
```

**Agent 2 — Chord Progression Presets**
```
Create a ChordPresets.tsx component with clickable buttons for three progressions: ii-V-I in C, I-vi-IV-V in C, and 12-Bar Blues in C. Place it below the piano in MainLayout.tsx. Wire each button to play the chord sequence using the existing audio engine in lib/audio.ts.
```

**Agent 3 — Sustain Pedal Toggle**
```
Add a sustain pedal toggle button to the Header (keyboard shortcut: spacebar). When on, notes continue ringing after the key is released. Wire it into the existing note release logic in lib/audio.ts using Tone.js. Show a visual indicator (lit up when active).
```

---

## Timing

| Time | Action |
|------|--------|
| 0:00 | Play a chord — set the scene |
| 0:15 | Paste Agent 1 prompt, hit enter |
| 0:25 | Paste Agent 2 prompt, hit enter |
| 0:35 | Paste Agent 3 prompt, hit enter |
| 1:00 | **Kanban moment** — zoom in on 3 active agent cards |
| 1:30 | Show the running app: use transpose, click preset, toggle sustain |
| 2:00 | Wrap |

---

## If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| Agent gets confused | Simplify: "Just add the button to Header, no audio wiring yet" |
| Conflict between agents | They touch different files — conflicts shouldn't happen |
| Feature doesn't work | Demo the Kanban view + one working feature; wave off the others |
| Server crashes | `npm run dev` again, it hot-reloads |

---

## Reset If You Need a Retake

```bash
git checkout demo-filming
git reset --hard origin/demo-filming
```

This wipes any agent changes and puts you back to the clean starting state.
