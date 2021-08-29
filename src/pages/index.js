import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import { dbConnect } from "@/middleware/db";
import { getSession } from "next-auth/client";
import User from "@/models/user";
import { Button } from "@material-ui/core";

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    return {
      props: {
        owner: false,
      },
    };
  }
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
    },
  };
}

export default function Home({ owner }) {
  return (
    <>
      <div style={{ padding: "2rem 0" }}>
        <div className="landing-text">
          <Typography
            color="primary"
            variant="h2"
            component="h1"
            align="center"
          >
            Landing page je u izradi
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            color="textPrimary"
          >
            FIN je platforma koja olakšava evidenciju poslovnih procesa,
            jednostavna je za korištenje te je dostupna bilo kada i bilo gdje.
          </Typography>
          <Typography variant="h4" align="center">
            <Button variant="outlined" color="primary" size="large">
              <Link
                href={
                  owner ? (owner.option ? "/all-items" : "/setup") : "/setup"
                }
              >
                Započnite korištenje
              </Link>
            </Button>
          </Typography>
        </div>
      </div>
    </>
  );
}
