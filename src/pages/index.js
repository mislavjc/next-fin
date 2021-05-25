import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div style={{ background: "#F5F9FF", padding: "2rem 0" }}>
        <div className="landing-text">
          <Typography
            variant="h2"
            component="h1"
            align="center"
            fontWeight={600}
          >
            Financije i narudžbenice, pojednostavljene
          </Typography>
          <Typography variant="h4" component="h2" align="center">
            FIN je platforma koja olakšava evidenciju poslovnih procesa,
            jednostavna je za korištenje te je dostupna bilo kada i bilo gdje.
          </Typography>
          <Button variant="contained" size="large" color="primary">
            <Link href="/setup">Započnite korištenje</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
