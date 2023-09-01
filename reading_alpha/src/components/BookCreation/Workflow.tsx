import React, { useState } from "react";
import CreateStory from "./CreateStory";
import CharacterSelection from "./CharacterSelection";
import SettingSelection from "./SettingSelection";
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
  const [settingInfo, setSettingInfo] = useState<string | null>(null);

  const handleNewStory = (page: string): void => {
    setCreationWorkflow(page);
  };

  const handleCharacterSelection = (info: string): void => {
    setCharacterInfo(info);
    setCreationWorkflow("SettingSelection");
  };

  const handleSettingSelection = (info: string): void => {
    setSettingInfo(info);
    console.log(info);
    handleCreateNewBook({
      setting: info!, // Use the new value directly
      character: characterInfo!,
      created: false,
    });
  };

  const handleBack = (): void => {
    switch (creationWorkflow) {
      case "CharacterSelection":
        setCreationWorkflow("CreateStory");
        break;
      case "SettingSelection":
        setCreationWorkflow("CharacterSelection");
        break;
      // Add more cases as your workflow expands
      default:
        break;
    }
  };

  return (
    <div>
      <h1>Workflow Component</h1>

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
          case "SettingSelection":
            return (
              <SettingSelection sendSettingInfo={handleSettingSelection} />
            );
          // Add more cases as your workflow expands
          default:
            return null;
        }
      })()}

      {characterInfo && <p>Selected Character: {characterInfo}</p>}
      {settingInfo && <p>Selected Setting: {settingInfo}</p>}
    </div>
  );
};

export default Workflow;
