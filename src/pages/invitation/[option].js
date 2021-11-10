import axios from 'axios';
import LocalizedStrings from 'react-localization';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import User from '@/models/user';
import Option from '@/models/option';

import { dbConnect } from '@/middleware/db';
import { useStrings } from '@/lib/use-strings';

export async function getServerSideProps(context) {
  dbConnect();
  const { option: id } = context.query;
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
    context.res.end();
    return {
      props: {
        owner: false,
        forms: false,
      },
    };
  }
  const { user } = session;
  const option = await Option.findById(id);
  const owner = await User.findOne({ email: user.email });
  const username = user.email.split('@')[0].replace('.', '');
  if (!(username in option.owner)) {
    return {
      props: {
        owner: false,
        option: false,
      },
    };
  }
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      option: JSON.parse(JSON.stringify(option)),
      username,
    },
  };
}

export default function Invitation({ owner, option, username }) {
  const { invite } = useStrings(Strings);

  const router = useRouter();
  const acceptInvitationHandler = () => {
    axios
      .post('/api/add-account/accepted-invitation', {
        id: owner._id,
        option,
        username,
      })
      .then(() => router.push('/all-items'));
  };

  return (
    <div>
      <Container
        maxWidth="sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
        }}
      >
        <Paper variant="outlined" style={{ padding: '1rem' }}>
          <Typography variant="h5" gutterBottom>
            {invite.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginBottom: '1rem' }}
          >
            {invite.label}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={acceptInvitationHandler}
          >
            {invite.button}
          </Button>
        </Paper>
      </Container>
    </div>
  );
}

const Strings = new LocalizedStrings({
  en: {
    invite: {
      title: 'Invitation to join the business',
      label: 'If you want to join the business, press the button below.',
      button: 'Accept invitation',
    },
  },
  hr: {
    invite: {
      title: 'Pozivnica za pridruživanje poslovanju',
      label: 'Ukoliko se želite pridružiti poslovanju, pritisnite gumb ispod.',
      button: 'Prihvati pozivnicu',
    },
  },
});
