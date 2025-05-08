
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
        
        // Always ensure animals is an array
        const validAnimals = Array.isArray(fetchedAnimals) ? fetchedAnimals : [];
        setAnimals(validAnimals);
        
        // Select first animal if none selected and we have animals
        if (!selectedAnimal && validAnimals.length > 0) {
          onAnimalChange(validAnimals[0].id);
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
        
        // Use fallback array as safety measure
        const fallbackAnimals = [
          { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "" },
          { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "" }
        ];
        setAnimals(fallbackAnimals);
        
        toast({
          title: "Error fetching animals",
          description: "Using fallback animal data. Please check network connection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getAnimals();
  }, [selectedAnimal, onAnimalChange, toast]);

  // Safe getter for selected animal name
  const getSelectedAnimalName = () => {
    if (!animals || animals.length === 0) return selectedAnimal || "Select animal...";
    const animal = animals.find(a => a.id === selectedAnimal);
    return animal ? `${animal.name} (${animal.id})` : selectedAnimal || "Select animal...";
  };

  // Initialize with guaranteed arrays to prevent "undefined is not iterable" error
  const safeAnimals = animals || [];
  const filteredAnimals = searchValue === "" 
    ? safeAnimals 
    : safeAnimals.filter((animal) => {
        return animal?.name?.toLowerCase().includes(searchValue.toLowerCase()) || 
               animal?.id?.toLowerCase().includes(searchValue.toLowerCase());
      }) || [];

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
          {!filteredAnimals || filteredAnimals.length === 0 ? (
            <CommandEmpty>No animal found.</CommandEmpty>
          ) : (
            <CommandGroup>
              {filteredAnimals.map((animal) => (
                <CommandItem
                  key={animal.id}
                  value={animal.id}
                  onSelect={(currentValue) => {
                    onAnimalChange(currentValue);
                    setOpen(false);
                    setSearchValue(""); // Clear search when item selected
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
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AnimalSelector;
