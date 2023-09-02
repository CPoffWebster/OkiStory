import React, { useState } from "react";
import CreateStory from "./CreateStory";
import CharacterSelection from "./CharacterSelection";
import LocationSelection from "./LocationSelection";
import { Book } from "../../classes/book";

export interface SelectBookInformation {
  sendBookInfo: (book: Book) => void;
}

const Workflow: React.FC<SelectBookInformation> = ({ sendBookInfo }) => {
  const handleCreateNewBook = (info: Book): void => {
    sendBookInfo(info);
  };

  const [creationWorkflow, setCreationWorkflow] =
    useState<string>("CreateStory");
  const [characterInfo, setCharacterInfo] = useState<string | null>(null);
  const [LocationInfo, setLocationInfo] = useState<string | null>(null);

  const handleNewStory = (page: string): void => {
    setCreationWorkflow(page);
  };

  const handleCharacterSelection = (info: string): void => {
    setCharacterInfo(info);
    setCreationWorkflow("LocationSelection");
  };

  const handleLocationSelection = (info: string): void => {
    setLocationInfo(info);
    console.log(info);
    handleCreateNewBook({
      location: info!, // Use the new value directly
      character: characterInfo!,
      created: false,
    });
  };

  const handleBack = (): void => {
    switch (creationWorkflow) {
      case "CharacterSelection":
        setCreationWorkflow("CreateStory");
        break;
      case "LocationSelection":
        setCreationWorkflow("CharacterSelection");
        break;
      // Add more cases as your workflow expands
      default:
        break;
    }
  };

  return (
    <div>
      {/* Back Button */}
      {creationWorkflow !== "CreateStory" && (
        <button onClick={handleBack}>Back</button>
      )}

      {/* Workflow Stages */}
      {(() => {
        switch (creationWorkflow) {
          case "CreateStory":
            return (
              <CreateStory
                initiateNewStory={() => handleNewStory("CharacterSelection")}
              />
            );
          case "CharacterSelection":
            return (
              <CharacterSelection
                sendCharacterInfo={handleCharacterSelection}
              />
            );
          case "LocationSelection":
            return (
              <LocationSelection sendLocationInfo={handleLocationSelection} />
            );
          // Add more cases as your workflow expands
          default:
            return null;
        }
      })()}

      {characterInfo && <p>Selected Character: {characterInfo}</p>}
      {LocationInfo && <p>Selected Location: {LocationInfo}</p>}
    </div>
  );
};

export default Workflow;
