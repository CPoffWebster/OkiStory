import Workflow from "./BookCreation/Workflow";
import { Book } from "../classes/book";

const HomePage = () => {
  const handleBookCreation = (newBook: Book): void => {
    console.log(newBook);
  };

  return (
    <>
      <Workflow sendBookInfo={handleBookCreation} />
    </>
  );
};

export default HomePage;
