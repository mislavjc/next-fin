import { useState } from "react";
import { useSession } from "next-auth/client";
import { Input } from "@/components/fields/Input";
import { dbConnect } from "@/middleware/db";
import Container from "@material-ui/core/Container";
import FieldType from "@/models/fieldType";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";

export async function getServerSideProps(context) {
  dbConnect();
  const fieldTypes = await FieldType.find({}).exec();
  return {
    props: {
      fieldTypes: JSON.parse(JSON.stringify(fieldTypes)),
    },
  };
}

export default function Form({ fieldTypes }) {
  const [session, loading] = useSession();
  const [dataObj, setDataObj] = useState({});

  const clickHandler = () => {
    const currentUser = session.user;
    const values = {
      currentUser,
      dataObj,
    };
    console.log(dataObj);
    axios
      .post("/api/crud/create", values)
      .then((response) => console.log(response));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">Unos</Typography>
      {fieldTypes.map((field) => (
        <div style={{ marginBottom: "1rem" }} key={field._id}>
          <Input
            name={field.name}
            type={field.type}
            id={field._id}
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
