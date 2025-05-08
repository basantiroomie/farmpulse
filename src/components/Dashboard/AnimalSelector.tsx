
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
import { useToast } from "@/hooks/use-toast";

interface AnimalSelectorProps {
  selectedAnimal: string;
  onAnimalChange: (animalId: string) => void;
}

const AnimalSelector = ({ selectedAnimal, onAnimalChange }: AnimalSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const getAnimals = async () => {
      setLoading(true);
      try {
        const fetchedAnimals = await fetchAllAnimals();
        console.log("Fetched animals:", fetchedAnimals);
        
        // Always ensure animals is an array and not undefined
        const validAnimals = Array.isArray(fetchedAnimals) ? fetchedAnimals : [];
        setAnimals(validAnimals);
        
        // Select first animal if none selected
        if (!selectedAnimal && validAnimals.length > 0) {
          onAnimalChange(validAnimals[0].id);
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
        // Set some dummy data if API fails
        const fallbackAnimals = [
          { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "" },
          { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "" }
        ];
        setAnimals(fallbackAnimals);
        
        toast({
          title: "Error fetching animals",
          description: "Using fallback animal data",
          variant: "destructive",
        });
        
        // Select first animal if none selected
        if (!selectedAnimal) {
          onAnimalChange(fallbackAnimals[0].id);
        }
      } finally {
        setLoading(false);
      }
    };
    
    getAnimals();
  }, [selectedAnimal, onAnimalChange, toast]);

  const getSelectedAnimalName = () => {
    if (!animals || animals.length === 0) return selectedAnimal || "Select animal...";
    const animal = animals.find(a => a.id === selectedAnimal);
    return animal ? `${animal.name} (${animal.id})` : selectedAnimal || "Select animal...";
  };

  // Ensure we have a valid animals array before filtering
  // Safeguard for animals being undefined or null
  const safeAnimals = Array.isArray(animals) ? animals : [];
  const filteredAnimals = searchValue === "" 
    ? safeAnimals 
    : safeAnimals.filter((animal) => {
        return animal.name.toLowerCase().includes(searchValue.toLowerCase()) || 
               animal.id.toLowerCase().includes(searchValue.toLowerCase());
      });

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
          {loading ? "Loading..." : getSelectedAnimalName()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search animal..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>No animal found.</CommandEmpty>
          <CommandGroup>
            {/* Always ensure we're mapping over a valid array */}
            {filteredAnimals.map((animal) => (
              <CommandItem
                key={animal.id}
                value={animal.id}
                onSelect={(currentValue) => {
                  onAnimalChange(currentValue);
                  setOpen(false);
                  setSearchValue("");
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
