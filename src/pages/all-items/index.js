import { useState } from "react";
import { useSession, getSession } from "next-auth/client";
import { dbConnect } from "@/middleware/db";
import Form from "@/models/form";
import User from "@/models/user";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  const { user } = session;
  const owner = await User.findOne({email: user.email})
  const forms = await Form.find({owner: owner._id}).populate({
    path: "inputs",
    populate: {
      path: "types"
    }
  });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      forms: JSON.parse(JSON.stringify(forms))
    },
  };
}

export default function allItems({ owner, forms }) {
  console.log(forms);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">test</Typography>
      {forms.map(form => (
        <p key={form._id}>{JSON.stringify(form)}</p>
      ))}
    </Container>
  );
}
