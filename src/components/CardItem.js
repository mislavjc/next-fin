import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import axios from "axios";

export const CardItem = ({ form }) => {
  const router = useRouter();
  const clickHandler = () => {
    router.push(`/all-items/${form._id}`);
  };
  const deleteHandler = () => {
    const id = form._id;
    console.log(id);
    axios.delete(`/api/crud/${id}`).then(router.push("/all-items"));
  };

  return (
      <Card>
        <CardContent>
          {form.inputs.map((input) => (
            <Typography
              className="card-content"
              variant="body1"
              key={input._id}
            >
              {input.type.name}: {input.value}
            </Typography>
          ))}
        </CardContent>
        <CardActions>
          <Button onClick={clickHandler} variant="contained" color="primary">
            Više
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outlined"
            color="secondary"
          >
            Nazad
          </Button>
          <Button
            onClick={() => router.push(`/all-items/${form._id}/edit`)}
            variant="outlined"
            color="primary"
          >
            Promjeni
          </Button>
          <Button onClick={deleteHandler} variant="contained" color="secondary">
            Obriši
          </Button>
        </CardActions>
      </Card>
  );
};
