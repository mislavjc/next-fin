import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { dbConnect } from "@/middleware/db";
import User from "@/models/user";
import Option from "@/models/option";

export async function getServerSideProps(context) {
  dbConnect();
  const {option: id} = context.query
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
    context.res.end();
    return {
      props: {
        owner: false,
        forms: false,
      },
    };
  }
  const { user } = session;
  const option = await Option.findById(id)
  const owner = await User.findOne({ email: user.email });
  for (let acc of option.owner) {
    if (user.email === acc) {
      owner.option = option;
      await owner.save();
      break;
    }
  }
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
    },
  };
}

export default function invitation({ owner }) {
  return <h1>{JSON.stringify(owner)}</h1>;
}
