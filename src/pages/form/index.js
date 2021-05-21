import { useState } from "react";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { Input } from "@/components/fields/Input";
import { dbConnect } from "@/middleware/db";
import Container from "@material-ui/core/Container";
import Type from "@/models/type";
import User from "@/models/user";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const types = await Type.find({ owner: owner._id });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      types: JSON.parse(JSON.stringify(types)),
    },
  };
}

export default function Form({ types, owner }) {
  const router = useRouter();
  const [dataObj, setDataObj] = useState({});

  const clickHandler = () => {
    const currentUser = owner._id;
    const values = {
      currentUser,
      dataObj,
    };
    axios
      .post("/api/crud/create", values)
      .then(router.push("/all-items"));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">Unos</Typography>
      {types.map((type) => (
        <div style={{ marginBottom: "1rem" }} key={type._id}>
          <Input
            name={type.name}
            type={type.type}
            id={type._id}
            dataObj={dataObj}
            setDataObj={setDataObj}
          />
        </div>
      ))}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        size="large"
        onClick={clickHandler}
      >
        Save
      </Button>
    </Container>
  );
}
