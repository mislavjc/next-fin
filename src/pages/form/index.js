import { useState } from "react";
import { session, loading } from "next-auth/client";
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
  console.log(fieldTypes);
  return {
    props: {
      fieldTypes: JSON.parse(JSON.stringify(fieldTypes)),
    },
  };
}

export default function Form({ fieldTypes }) {
  // console.log(fieldTypes[0]);
  const [dataObj, setDataObj] = useState({});

  const  clickHandler = () => {
    console.log(dataObj);
    axios.post('/api/')
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
