import { BasicOptions } from "@/components/setup/BasicOptions";
import Grid from "@material-ui/core/Grid";

export default function Setup() {

  return (
    <div className="container">
      <Grid item xs={12} md={6}>
        <BasicOptions />
      </Grid>
    </div>
  );
}
