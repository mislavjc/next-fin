import { getCsrfToken } from 'next-auth/client';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

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
