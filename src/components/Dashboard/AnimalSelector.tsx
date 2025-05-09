import { useCallback, useEffect, useRef, useState } from "react";

// Define fallback animals
const FALLBACK_ANIMALS = [
  { id: "A12345", name: "Daisy", breed: "Holstein", dob: "2022-03-15", gender: "Female", created_at: "" },
  { id: "A12346", name: "Bella", breed: "Jersey", dob: "2021-07-22", gender: "Female", created_at: "" },
  { id: "A12347", name: "Max", breed: "Angus", dob: "2023-01-10", gender: "Male", created_at: "" },
  { id: "A12348", name: "Lucy", breed: "Hereford", dob: "2021-11-05", gender: "Female", created_at: "" }
];

// Type definition for Animal
interface Animal {
  id: string;
  name: string;
  breed: string;
  dob: string;
  gender: string;
  created_at: string;
}

interface AnimalSelectorProps {
  selectedAnimal: string;
  onAnimalChange: (animalId: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const AnimalSelector = ({ 
  selectedAnimal = "", 
  onAnimalChange, 
  label = "Animal", 
  placeholder = "Select animal...",
  className = ""
}: AnimalSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>(FALLBACK_ANIMALS);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Safe handler for animal selection
  const handleSelect = useCallback((animalId: string) => {
    try {
      if (animalId && typeof onAnimalChange === 'function') {
        onAnimalChange(animalId);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error selecting animal:", error);
      setIsOpen(false);
    }
  }, [onAnimalChange]);

  // Get selected animal name safely
  const getSelectedAnimalName = () => {
    try {
      if (!selectedAnimal) return placeholder;
      
      const animal = animals.find(a => a.id === selectedAnimal);
      return animal ? `${animal.name} (${animal.id})` : placeholder;
    } catch (e) {
      console.error("Error getting animal name:", e);
      return placeholder;
    }
  };

  // Filter animals safely
  const filteredAnimals = animals.filter(animal => {
    if (!searchValue) return true;
    
    const search = searchValue.toLowerCase();
    return (
      (animal.name?.toLowerCase().includes(search) || false) ||
      (animal.id?.toLowerCase().includes(search) || false) ||
      (animal.breed?.toLowerCase().includes(search) || false)
    );
  });

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="text-sm font-medium mb-1 block text-foreground">
          {label}
        </label>
      )}
      
      {/* Button selector - Updated with theme-aware colors */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center px-3 py-2 border rounded-md bg-background text-foreground"
      >
        <span>{getSelectedAnimalName()}</span>
        <span className="ml-2">▼</span>
      </button>
      
      {/* Dropdown - Updated with theme-aware colors */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg"
        >
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search animals..."
              className="w-full px-2 py-1 border rounded bg-background text-foreground"
              autoFocus
            />
          </div>
          
          {/* Animal list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAnimals.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">No animals found</div>
            ) : (
              filteredAnimals.map((animal) => (
                <div
                  key={animal.id}
                  onClick={() => handleSelect(animal.id)}
                  className={`flex justify-between p-2 cursor-pointer hover:bg-accent text-foreground ${
                    selectedAnimal === animal.id ? 'bg-primary/20' : ''
                  }`}
                >
                  <div>
                    <span className="font-medium">{animal.name}</span>
                    <span className="text-muted-foreground"> ({animal.id})</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{animal.gender}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalSelector;