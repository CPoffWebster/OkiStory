import React from "react";
import { SettingSelectionProps } from "../../classes/book";

const SettingSelection: React.FC<SettingSelectionProps> = ({
  sendSettingInfo,
}) => {
  const handleSelectSetting = (setting: string): void => {
    sendSettingInfo(setting);
  };

  return (
    <div>
      <h2>Setting Selection</h2>
      <button onClick={() => handleSelectSetting("Setting 1")}>
        Setting 1
      </button>
      <button onClick={() => handleSelectSetting("Setting 2")}>
        Setting 2
      </button>
    </div>
  );
};

export default SettingSelection;
