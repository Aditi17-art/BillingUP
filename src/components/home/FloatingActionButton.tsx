import { IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FloatingActionButton = () => {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 max-w-lg mx-auto">
      <Link to="/add-sale" className="block">
        <Button variant="floating" size="xl" className="w-full shadow-glow animate-bounce-subtle">
          <IndianRupee className="w-5 h-5" />
          <span>Add New Sale</span>
        </Button>
      </Link>
    </div>
  );
};
