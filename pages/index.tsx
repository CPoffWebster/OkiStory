import { GetServerSideProps } from "next";
import { checkCookies } from "../services/cookies";
import { encrypt } from "@/services/encryption";
// import "bootstrap/dist/css/bootstrap.css";

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

export default function HomePage(props: { user: any }) {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}
