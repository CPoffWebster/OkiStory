import React from "react";

interface CreateStoryProps {
  initiateNewStory: () => void;
}

/**
 * Create a new story button
 * @param initiateNewStory
 * @returns
 */
const CreateStory: React.FC<CreateStoryProps> = ({ initiateNewStory }) => {
  return (
    <div>
      <h2>Create Story</h2>
      <button onClick={initiateNewStory}>New Story</button>
    </div>
  );
};

export default CreateStory;
