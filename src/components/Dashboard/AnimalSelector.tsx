import { useState, useEffect, useCallback, useRef } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
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

// Define fallback animals outside of component to prevent recreation on each render
const FALLBACK_ANIMALS = [
  { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "" },
  { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "" },
  { id: "A12347", name: "Max", breed: "Angus", dob: "2023-01-10", gender: "Male", created_at: "" },
  { id: "A12348", name: "Lucy", breed: "Hereford", dob: "2021-11-05", gender: "Female", created_at: "" }
];

interface AnimalSelectorProps {
  selectedAnimal: string;
  onAnimalChange: (animalId: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const AnimalSelector = ({ 
  selectedAnimal, 
  onAnimalChange, 
  label = "Animal", 
  placeholder = "Select animal...",
  className = ""
}: AnimalSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>(FALLBACK_ANIMALS);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Memoized animal change handler to prevent recreation on each render
  const handleAnimalChange = useCallback((animalId: string) => {
    try {
      if (animalId && typeof onAnimalChange === 'function') {
        onAnimalChange(animalId);
      }
    } catch (error) {
      console.error("Error in handleAnimalChange:", error);
      toast({
        title: "Error selecting animal",
        description: "There was a problem selecting this animal.",
        variant: "destructive",
      });
    }
  }, [onAnimalChange, toast]);

  // Fetch animals only when the dropdown is opened for the first time
  const fetchAnimalsOnDemand = useCallback(async () => {
    if (hasLoaded) return;
    
    setLoading(true);
    
    try {
      const fetchedAnimals = await fetchAllAnimals();
      
      // Always ensure animals is a valid array
      const validAnimals = Array.isArray(fetchedAnimals) && fetchedAnimals.length > 0 
        ? fetchedAnimals 
        : [...FALLBACK_ANIMALS];
        
      setAnimals(validAnimals);
      setHasLoaded(true);
    } catch (error) {
      console.error("Error fetching animals:", error);
      
      toast({
        title: "Error fetching animals",
        description: "Using fallback animal data. Please check network connection.",
        variant: "destructive",
      });
      
      // Use fallback array as safety measure
      setAnimals([...FALLBACK_ANIMALS]);
    } finally {
      setLoading(false);
    }
  }, [hasLoaded, toast]);

  // Safe getter for selected animal name with error boundary
  const getSelectedAnimalName = () => {
    try {
      if (!selectedAnimal) return placeholder;
      if (!animals || animals.length === 0) return selectedAnimal || placeholder;
      
      const animal = animals.find(a => a && a.id === selectedAnimal);
      return animal ? `${animal.name || 'Unknown'} (${animal.id || 'Unknown ID'})` : (selectedAnimal || placeholder);
    } catch (e) {
      console.error("Error in getSelectedAnimalName:", e);
      return placeholder;
    }
  };

  // Filter animals with error boundary
  const getFilteredAnimals = () => {
    try {
      // Ensure we always have a valid array, never undefined or null
      const safeAnimals = Array.isArray(animals) ? animals.filter(animal => animal !== null && animal !== undefined) : [];
      
      if (searchValue === "") return safeAnimals;
      
      const searchLower = searchValue.toLowerCase();
      
      return safeAnimals.filter((animal) => {
        // Skip null/undefined values
        if (!animal) return false;
        
        const nameMatch = animal.name ? 
          animal.name.toLowerCase().includes(searchLower) : 
          false;
          
        const idMatch = animal.id ? 
          animal.id.toLowerCase().includes(searchLower) : 
          false;
          
        const breedMatch = animal.breed ?
          animal.breed.toLowerCase().includes(searchLower) :
          false;
          
        return nameMatch || idMatch || breedMatch;
      });
    } catch (e) {
      console.error("Error filtering animals:", e);
      return [];
    }
  };

  // Get filtered animals once to avoid recalculating
  const filteredAnimals = getFilteredAnimals();
  
  // Safe selection handler with error boundary
  const handleSelectionChange = (value: string) => {
    try {
      if (value) {
        handleAnimalChange(value);
        setOpen(false);
        setSearchValue(""); // Clear search when item selected
      }
    } catch (e) {
      console.error("Error in handleSelectionChange:", e);
      setOpen(false); // At least close the dropdown
    }
  };

  // Handle popover state changes safely
  const handleOpenChange = (newOpen: boolean) => {
    try {
      setOpen(newOpen);
      
      if (newOpen) {
        // Fetch data when opening for the first time
        fetchAnimalsOnDemand();
        setSearchValue(""); // Clear search when opening dropdown
        
        // Focus the input after opening
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      }
    } catch (e) {
      console.error("Error in handleOpenChange:", e);
    }
  };

  // Safe search value change handler
  const handleSearchChange = (value: string) => {
    try {
      setSearchValue(value);
    } catch (e) {
      console.error("Error in handleSearchChange:", e);
    }
  };

  // Render animal groups by breed for better organization
  const renderAnimalGroups = () => {
    if (!filteredAnimals || filteredAnimals.length === 0) {
      return <CommandEmpty>No animals found.</CommandEmpty>;
    }

    // Group by breed
    const breedGroups = filteredAnimals.reduce((groups, animal) => {
      if (!animal || !animal.breed) return groups;
      
      const breed = animal.breed;
      if (!groups[breed]) {
        groups[breed] = [];
      }
      groups[breed].push(animal);
      return groups;
    }, {} as Record<string, Animal[]>);

    // If there are no valid breed groups (shouldn't happen with our checks)
    if (Object.keys(breedGroups).length === 0) {
      return (
        <CommandGroup>
          {filteredAnimals.map((animal) => renderAnimalItem(animal))}
        </CommandGroup>
      );
    }

    // Render by breed groups
    return Object.entries(breedGroups).map(([breed, animals]) => (
      <CommandGroup key={breed} heading={breed}>
        {animals.map((animal) => renderAnimalItem(animal))}
      </CommandGroup>
    ));
  };

  // Render an individual animal item
  const renderAnimalItem = (animal: Animal) => {
    if (!animal || !animal.id) return null;
    
    return (
      <CommandItem
        key={animal.id}
        value={animal.id}
        onSelect={handleSelectionChange}
        className="flex items-center justify-between"
      >
        <div className="flex items-center">
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedAnimal === animal.id ? "opacity-100" : "opacity-0"
            )}
          />
          <div>
            <span className="font-medium">{animal.name || "Unknown"}</span>
            <span className="text-muted-foreground"> ({animal.id})</span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {animal.gender || "Unknown"}
        </span>
      </CommandItem>
    );
  };

  // Render with error boundaries
  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label className="text-sm font-medium mb-1 block">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading && !hasLoaded} // Only disable if loading initial data
          >
            {loading && !hasLoaded ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading animals...</span>
              </>
            ) : (
              <>
                <span className="truncate">{getSelectedAnimalName()}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0 z-50" align="start" sideOffset={5}>
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                ref={inputRef}
                placeholder="Search animals..." 
                value={searchValue}
                onValueChange={handleSearchChange}
                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            
            {loading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading animals...</p>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {renderAnimalGroups()}
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AnimalSelector;