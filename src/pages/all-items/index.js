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
  const session = await getSession(context);
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const forms = await Form.find({ owner: owner._id }).populate({
    path: "inputs",
    populate: {
      path: "type",
    },
  });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      forms: JSON.parse(JSON.stringify(forms)),
    },
  };
}

export default function allItems({ forms }) {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Unosi</Typography>
      <Grid container spacing={4}>
        {forms.map((form, index) => (
          <CardItem form={form} key={index} />
        ))}
      </Grid>
    </Container>
  );
}
