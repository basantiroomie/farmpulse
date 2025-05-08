
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchAllAnimals } from "@/lib/api";
import { Animal } from "@/lib/api";

interface AnimalSelectorProps {
  selectedAnimal: string;
  onAnimalChange: (animalId: string) => void;
}

const AnimalSelector = ({ selectedAnimal, onAnimalChange }: AnimalSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnimals = async () => {
      setLoading(true);
      const fetchedAnimals = await fetchAllAnimals();
      setAnimals(fetchedAnimals);
      setLoading(false);
      
      // Select first animal if none selected
      if (!selectedAnimal && fetchedAnimals.length > 0) {
        onAnimalChange(fetchedAnimals[0].id);
      }
    };
    
    getAnimals();
  }, []);

  const getSelectedAnimalName = () => {
    const animal = animals.find(a => a.id === selectedAnimal);
    return animal ? `${animal.name} (${animal.id})` : selectedAnimal;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {loading ? "Loading..." : selectedAnimal ? getSelectedAnimalName() : "Select animal..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search animal..." />
          <CommandEmpty>No animal found.</CommandEmpty>
          <CommandGroup>
            {animals.map((animal) => (
              <CommandItem
                key={animal.id}
                value={animal.id}
                onSelect={(currentValue) => {
                  onAnimalChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedAnimal === animal.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {animal.name} ({animal.id})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AnimalSelector;
