import React from "react";

export interface LocationSelectionProps {
  sendLocationInfo: (Location: string) => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({
  sendLocationInfo,
}) => {
  const handleSelectLocation = (Location: string): void => {
    sendLocationInfo(Location);
  };

  return (
    <div>
      <h2>Location Selection</h2>
      <button onClick={() => handleSelectLocation("Location 1")}>
        Location 1
      </button>
      <button onClick={() => handleSelectLocation("Location 2")}>
        Location 2
      </button>
    </div>
  );
};

export default LocationSelection;
