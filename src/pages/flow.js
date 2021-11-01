import { useRouter } from 'next/router';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import { useStrings } from '@/lib/use-strings';

import Strings from '@/translation/flow/Strings';

export default function Flow() {
  const router = useRouter();

  const { imp, setup, button } = useStrings(Strings);

  return (
    <>
      <Container maxWidth="md">
        <Paper variant="outlined" style={{ padding: '1rem' }}>
          <div className="flow">
            <div>
              <Typography variant="h5">{imp.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {imp.subtitle}
              </Typography>
              <UploadFileIcon
                style={{
                  fontSize: '8rem',
                  marginBottom: '1rem',
                  marginTop: '1rem',
                }}
              />
              <Button
                variant="outlined"
                onClick={() => router.push('/import')}
                style={{ marginBottom: '1rem' }}
              >
                {button}
              </Button>
            </div>
            <div>
              <Typography variant="h5">{setup.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {setup.subtitle}
              </Typography>
              <AppRegistrationIcon
                style={{
                  fontSize: '8rem',
                  marginBottom: '1rem',
                  marginTop: '1rem',
                }}
              />
              <Button
                variant="outlined"
                onClick={() => router.push('/setup')}
                style={{ marginBottom: '1rem' }}
              >
                {button}
              </Button>
            </div>
          </div>
        </Paper>
      </Container>
    </>
  );
}
