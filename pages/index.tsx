import { GetServerSideProps } from "next";
import { checkCookies } from "../services/cookies";
import "bootstrap/dist/css/bootstrap.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await checkCookies(context.req);
  if (!user) {
    return {
      redirect: {
        destination: "/login/identifier",
        permanent: false,
      },
    };
  }
  return {
    props: { user },
  };
};

export default function HomePage() {
  // Your component logic here
  //   const test = user;
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}
