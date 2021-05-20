import { BasicOptions } from "@/components/setup/BasicOptions";
import Grid from "@material-ui/core/Grid";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Setup() {
  const [session, loading] = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session && !loading) {
      router.push("/api/auth/signin");
    }
  }, [session, loading]);

  return (
    <div className="container">
      <Grid item xs={12} md={6}>
        <BasicOptions />
      </Grid>
    </div>
  );
}
