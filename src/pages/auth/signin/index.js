import LocalizedStrings from 'react-localization';
import { getCsrfToken } from 'next-auth/client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

import { useStrings } from '@/lib/use-strings';

export default function SignIn({ csrfToken }) {
  const { login } = useStrings(Strings);

  return (
    <Container
      maxWidth="xs"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
      }}
    >
      <Paper variant="outlined" maxWidth="xs" style={{ padding: '1rem' }}>
        <Typography variant="h6" gutterBottom>
          {login.title}
        </Typography>
        <form method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <TextField
            type="email"
            id="email"
            name="email"
            variant="filled"
            label={login.label}
            fullWidth
            style={{ marginBottom: '1rem' }}
          />
          <Button color="primary" variant="outlined" type="submit">
            {login.button}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

const Strings = new LocalizedStrings({
  en: {
    login: {
      title: 'Log in to the application',
      label: 'Login using e-mail',
      button: 'Login',
    },
  },
  hr: {
    login: {
      title: 'Prijavite se u aplikaciju',
      label: 'Prijava e-mailom',
      button: 'Prijavi se',
    },
  },
});
