import { GetServerSideProps } from "next";
import { checkCookies } from "../services/cookies";
import "bootstrap/dist/css/bootstrap.css";
import { encrypt } from "@/services/encryption";
import { UsersAttributes } from "@/services/database/models/Users";

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("context", context);
  const user = await checkCookies(context.req);
  if (!user) {
    return {
      redirect: {
        destination: `/login/identifier?state=${encrypt("")}`,
        permanent: false,
      },
    };
  }
  console.log("USER FOUND HERE", user);

  return {
    props: { user: user },
  };
};

export default function HomePage(props: { user: any }) {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}
