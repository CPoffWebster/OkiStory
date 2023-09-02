import React, { useState } from "react";
import CreateStory from "./CreateStory";
import StoryElementSelection from "./StoryElementSelection";
import { Book } from "../../classes/book";
import { getAllDefaultCharacters } from "../../utilities/Characters";
import { getAllDefaultLocations } from "../../utilities/Locations";

export interface SelectBookInformation {
  sendBookInfo: (book: Book) => void;
}

const Workflow: React.FC<SelectBookInformation> = ({ sendBookInfo }) => {
  const [creationWorkflow, setCreationWorkflow] =
    useState<string>("CreateStory");
  const [characterInfo, setCharacterInfo] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);

  const handleCreateNewBook = (info: Book): void => {
    sendBookInfo(info);
  };

  const handleStoryElementSelection = (type: string, info: string): void => {
    if (type === "Character") {
      setCharacterInfo(info);
      setCreationWorkflow("LocationSelection");
    } else if (type === "Location") {
      setLocationInfo(info);
      handleCreateNewBook({
        location: info,
        character: characterInfo!,
        created: false,
      });
    }
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
                initiateNewStory={() =>
                  setCreationWorkflow("CharacterSelection")
                }
              />
            );
          case "CharacterSelection":
            return (
              <StoryElementSelection
                title="Choose your <u style='color: purple'>Main Character</u>!"
                fetchElements={getAllDefaultCharacters}
                sendElementInfo={(info) =>
                  handleStoryElementSelection("Character", info)
                }
              />
            );
          case "LocationSelection":
            return (
              <StoryElementSelection
                title="Choose your <u style='color: purple'>Location</u>!"
                fetchElements={getAllDefaultLocations}
                sendElementInfo={(info) =>
                  handleStoryElementSelection("Location", info)
                }
              />
            );
          default:
            return null;
        }
      })()}

      {/* Display Selected Information */}
      {characterInfo && <p>Selected Character: {characterInfo}</p>}
      {locationInfo && <p>Selected Location: {locationInfo}</p>}
    </div>
  );
};

export default Workflow;
