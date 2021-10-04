import Link from 'next/link';
import { getSession } from 'next-auth/client';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import User from '@/models/user';

import { dbConnect } from '@/middleware/db';
import { useStrings } from '@/lib/use-strings';

import Strings from '@/translation/index/Strings';

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
  const { hero } = useStrings(Strings);

  return (
    <>
      <div style={{ padding: '2rem 0' }}>
        <div className="landing-text">
          <Typography
            color="primary"
            variant="h2"
            component="h1"
            align="center"
          >
            {hero.title}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            color="textPrimary"
          >
            {hero.subtitle}
          </Typography>
          <Typography variant="h4" align="center">
            <Button variant="outlined" color="primary" size="large">
              <Link
                href={
                  owner ? (owner.option ? '/all-items' : '/setup') : '/setup'
                }
              >
                {hero.button}
              </Link>
            </Button>
          </Typography>
        </div>
      </div>
    </>
  );
}
