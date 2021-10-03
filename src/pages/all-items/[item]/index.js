import { useRouter } from 'next/router';
import { useState } from 'react';
import { getSession } from 'next-auth/client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { CardItem } from '@/components/CardItem';

import Form from '@/models/form';
import User from '@/models/user';
import Type from '@/models/type';

import { dbConnect } from '@/middleware/db';

export async function getServerSideProps(context) {
  dbConnect();
  const { item: id } = context.query;
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
    context.res.end();
    return {
      props: {
        owner: false,
        form: false,
      },
    };
  }
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const types = await Type.find({ option: owner.option });
  const form = await Form.findById(id).populate({
    path: 'inputs',
    populate: {
      path: 'type',
    },
  });
  if (JSON.stringify(form.option) !== JSON.stringify(owner.option)) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
    context.res.end();
    return {
      props: {
        owner: false,
        form: false,
      },
    };
  }
  return {
    props: {
      types: JSON.parse(JSON.stringify(types)),
      form: JSON.parse(JSON.stringify(form)),
      owner: JSON.parse(JSON.stringify(owner)),
    },
  };
}

export default function Item({ form, types, owner }) {
  const router = useRouter();
  const [showMore, setShowMore] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [initialValue, setInitialValue] = useState({});

  return (
    <Container maxWidth="lg">
      <Grid container justify="center">
        <Grid item xs={12} md={8} lg={6}>
          <CardItem
            showBack={true}
            form={form}
            types={types}
            owner={owner}
            setShowEditForm={setShowEditForm}
            setInitialValue={setInitialValue}
            onOpen={() => setShowMore({ ...showMore, [form._id]: true })}
          />
          <Button
            variant="outlined"
            color="primary"
            style={{ marginTop: '1rem' }}
            onClick={() => router.back()}
          >
            Nazad
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
