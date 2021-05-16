import { BasicOptions } from "@/components/setup/BasicOptions";
import { useSession } from "next-auth/client";
import Grid from "@material-ui/core/Grid";

export default function Setup() {
  const [session, loading] = useSession();

  return (
    <div className="container">
      <Grid item xs={12} md={6}>
        <BasicOptions />
      </Grid>
    </div>
  );
}
