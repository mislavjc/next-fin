import { useState } from "react";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { Input } from "@/components/fields/Input";
import { dbConnect } from "@/middleware/db";
import Container from "@material-ui/core/Container";
import Type from "@/models/type";
import User from "@/models/user";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
    context.res.end();
    return {
      props: {
        owner: false,
        types: false,
      },
    };
  }
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
    axios.post("/api/crud/create", values).then(router.push("/all-items"));
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
            additional={type.additional || null}
          />
        </div>
      ))}
      <IconButton onClick={clickHandler} style={{ float: "right" }}>
        <SaveIcon />
      </IconButton>
    </Container>
  );
}
