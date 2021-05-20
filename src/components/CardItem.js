import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";

export const CardItem = ({ form }) => {
  const router = useRouter();
  const clickHandler = () => {
    router.push(`/all-items/${form._id}`);
  };

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card key={form._id}>
        <CardContent>
          {form.inputs.map((input) => (
            <Typography className="card-content" variant="p">
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
        </CardActions>
      </Card>
    </Grid>
  );
};