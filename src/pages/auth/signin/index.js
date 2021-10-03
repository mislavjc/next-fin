import { getCsrfToken } from 'next-auth/client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

export default function SignIn({ csrfToken }) {
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
          Prijavite se u aplikaciju
        </Typography>
        <form method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <TextField
            type="email"
            id="email"
            name="email"
            variant="filled"
            label="Prijava e-mailom"
            fullWidth
            style={{ marginBottom: '1rem' }}
          />
          <Button color="primary" variant="outlined" type="submit">
            Prijavi se
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
