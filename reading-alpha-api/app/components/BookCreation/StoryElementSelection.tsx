import React, { useEffect, useState } from "react";
import "./StoryElementSelection.css";

export interface StoryElement {
  name: string;
  imageUrl: string;
}

export interface StoryElementSelectionProps {
  sendElementInfo: (element: string) => void;
  fetchElements: () => Promise<StoryElement[]>;
  title: string;
}

/**
 * Select a story element
 * @param sendElementInfo
 * @param fetchElements
 * @param title
 * @returns
 */
const StoryElementSelection: React.FC<StoryElementSelectionProps> = ({
  sendElementInfo,
  fetchElements,
  title,
}) => {
  const [elements, setElements] = useState<StoryElement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedElements = await fetchElements();
        setElements(fetchedElements);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, [fetchElements]);

  const handleSelectElement = (element: string): void => {
    sendElementInfo(element);
  };

  return (
    <div>
      <h2 className="title" dangerouslySetInnerHTML={{ __html: title }}></h2>
      <div className="selection-container">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading &&
          !error &&
          elements.map((element, index) => (
            <button
              className="selection-button"
              key={index}
              onClick={() => handleSelectElement(element.name)}
            >
              <img src={element.imageUrl} alt={element.name} />
              <br />
              {element.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default StoryElementSelection;
