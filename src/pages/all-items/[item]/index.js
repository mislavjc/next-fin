import { getSession } from "next-auth/client";
import { dbConnect } from "@/middleware/db";
import Form from "@/models/form";
import User from "@/models/user";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { CardItem } from "@/components/CardItem";

export async function getServerSideProps(context) {
  dbConnect();
  const { item: id } = context.query;
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
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
  const form = await Form.findById(id).populate({
    path: "inputs",
    populate: {
      path: "type",
    },
  });
  if (form.owner !== owner) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
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
      owner: JSON.parse(JSON.stringify(owner)),
      form: JSON.parse(JSON.stringify(form)),
    },
  };
}

export default function allItems({ form }) {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Unosi</Typography>
      <Grid container justify="center">
        <Grid item xs={12} md={8} lg={6}>
          <CardItem form={form} />
        </Grid>
      </Grid>
    </Container>
  );
}
