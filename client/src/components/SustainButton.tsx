import { FC } from "react";
import { Button } from "@/components/ui/button";
import { setSustain, getSustain } from "@/lib/audio";

interface SustainButtonProps {
  sustain: boolean;
  onToggle: (sustain: boolean) => void;
  className?: string;
}

const SustainButton: FC<SustainButtonProps> = ({ sustain, onToggle, className = "" }) => {
  const handleToggle = () => {
    const newSustain = !sustain;
    setSustain(newSustain);
    onToggle(newSustain);
  };

  return (
    <Button
      onClick={handleToggle}
      variant={sustain ? "default" : "outline"}
      size="sm"
      className={`${className} ${sustain ? "bg-amber-500 hover:bg-amber-600" : ""}`}
      title={sustain ? "Sustain On (Pedal Active)" : "Sustain Off"}
    >
      <span className="mr-2">🎹</span>
      Sustain {sustain ? "ON" : "OFF"}
    </Button>
  );
};

export default SustainButton;
