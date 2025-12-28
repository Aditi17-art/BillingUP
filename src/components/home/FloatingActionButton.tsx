import { IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 max-w-lg mx-auto">
      <Button 
        variant="floating" 
        size="xl" 
        className="w-full shadow-glow animate-bounce-subtle"
        onClick={onClick}
      >
        <IndianRupee className="w-5 h-5" />
        <span>Add New Sale</span>
      </Button>
    </div>
  );
};
