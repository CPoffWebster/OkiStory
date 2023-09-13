import { GetServerSideProps } from "next";
import { checkCookies } from "../services/cookies";
import { encrypt } from "@/services/encryption";
import { settingsIcon } from "@/data/icons";
import Link from "next/link";
import "./homepage.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await checkCookies(context.req);
  if (!user) {
    return {
      redirect: {
        destination: `/login/identifier?state=${encrypt("")}`,
        permanent: false,
      },
    };
  }

  return {
    props: { user: user },
  };
};

export default function HomePage() {
  return (
    <div className="container">
      <div className="header">
        <button>{settingsIcon}</button>
        <h1>Reading Alpha</h1>
        <div></div> {/* Empty div for layout balance */}
      </div>

      <div className="main-content">
        {/* Left Section */}
        <div className="section">
          <img src="/changeImage.jpg" alt="Books" />
          <Link href="/bookshelf/books">
            <button className="button">Book Shelf</button>
          </Link>
        </div>

        {/* Right Section */}
        <div className="section">
          <img src="/changeImage.jpg" alt="Open Book" />
          <Link href="/newstory">
            <button className="button">New Story</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
