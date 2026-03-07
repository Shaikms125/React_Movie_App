import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface SearchBoxProps {
  onSearch?: (searchTerm: string) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchBox({
  onSearch,
  searchTerm,
  setSearchTerm,
}: SearchBoxProps) {
  //const [searchValue, setSearchValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateInput = (value: string) => {
    // Example validation: check if input is empty or too short
    if (!value.trim()) {
      setIsInvalid(true);
      setErrorMessage("Search term cannot be empty");
      return false;
    }
    if (value.length < 2) {
      setIsInvalid(true);
      setErrorMessage("Search term must be at least 2 characters");
      return false;
    }
    setIsInvalid(false);
    setErrorMessage("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Clear error when user starts typing
    if (isInvalid) {
      validateInput(value);
    }
  };

  const handleSearch = () => {
    if (validateInput(searchTerm)) {
      if (onSearch) {
        onSearch(searchTerm);
      }
      console.log("Valid search:", searchTerm);
      // Perform actual search here
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className=" max-w-lg px-4 md:min-w-lg">
      <Field>
        <ButtonGroup className="min-h-12">
          <Input
            id="input-button-group"
            placeholder="Type to search movies..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-invalid={isInvalid ? "true" : "false"}
            aria-describedby={isInvalid ? "error-message" : undefined}
            className="h-auto"
          />
          <Button
            type="button"
            variant={"default"}
            onClick={handleSearch}
            className="h-auto px-4"
          >
            Search
          </Button>
        </ButtonGroup>
        {isInvalid && errorMessage && (
          <p id="error-message" className="mt-2 text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </Field>
    </div>
  );
}
