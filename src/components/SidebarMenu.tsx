import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { PokemonTextInput } from "./PokemonTextInput";

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/4 -translate-y-1/2  p-3 rounded-l-lg 
             bg-orange-500 hover:bg-orange-700 text-white shadow-lg
              transition-all duration-[300ms] ease-in-out z-998 ${
                isOpen ? `right-[40%]` : "right-0"
              }`}
      >
        <ChevronLeft
          className={`size-6 transition-transform duration-[300ms] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`fixed top-0 right-0 h-full w-[40%]
             bg-white shadow-2xl 
             transition-transform duration-[300ms] ease-in-out z-999 ${
               isOpen ? "translate-x-0" : "translate-x-full"
             }`}
      >
        <PokemonTextInput />
        {/* <ColumnEnabler /> */}
      </div>
      <div
        className={`fixed inset-0  transition-all duration-[600ms] ease-in-out z-997 ${
          isOpen ? "bg-black/30" : "hidden bg-black/50"
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}

export default SidebarMenu;
