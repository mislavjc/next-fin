import { getSession } from "next-auth/client";
import Link from "next/link";
import { dbConnect } from "@/middleware/db";
import Form from "@/models/form";
import User from "@/models/user";
import Type from "@/models/type";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PaymentIcon from "@material-ui/icons/Payment";
import StorageIcon from "@material-ui/icons/Storage";
import ArchiveIcon from "@material-ui/icons/Archive";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SearchIcon from "@material-ui/icons/Search";
import FeedbackIcon from "@material-ui/icons/Feedback";
import GetAppIcon from "@material-ui/icons/GetApp";
import CategoryIcon from "@material-ui/icons/Category";
import FormatLineSpacingIcon from "@material-ui/icons/FormatLineSpacing";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AddIcon from "@material-ui/icons/Add";

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
    context.res.end();
    return {
      props: {
        owner: false,
        forms: false,
      },
    };
  }
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const types = await Type.countDocuments({ owner: owner._id });
  const forms = await Form.countDocuments({ owner: owner._id, archived: false });
  const archived = await Form.countDocuments({ owner: owner._id, archived: true });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      types,
      forms,
      archived,
    },
  };
}

export default function account({ owner, types, forms, archived }) {
  return (
    <Container maxWidth="md">
      <div className="account-header">
        <Avatar>{owner.email[0]}</Avatar>
        <Typography variant="h5">Dobrodošao, {owner.email}</Typography>
        <Typography variant="body1">Promjenite postavke računa</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Korisničko ime"
                  secondary={owner.email.split("@")[0]}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Plaćanje"
                  secondary="Mastercard **** **** **** 1234"
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemText primary="Promjenite metodu plaćanja" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <DataUsageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Podatci"
                  secondary="Iskorišteno 14/15 GB"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <GetAppIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Eksport podataka"
                  secondary="Preuzmite sve svoje podatke u CSV formatu"
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemText primary="Promjenite plan pretplate" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Unosi"
                  secondary={<>Ukupno dodano {forms} unosa</>}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ArchiveIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Arhivi"
                  secondary={<>Arhivirano ukupno {archived} unosa</>}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <Link href="/all-items">
                <ListItem button>
                  <ListItemText primary="Pregled svih unosa" />
                </ListItem>
              </Link>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Polja za unos podataka"
                  secondary={<>Odabrano {types} polja za unos podataka</>}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <FormatLineSpacingIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Raspored polja za unos"
                  secondary="Promjenite raspored polja za unos"
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemText primary="Promjenite kategorije" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <List>
              <ListItem button>
                <ListItemText
                  primary={
                    <Typography variant="h5">Dodani korisnici</Typography>
                  }
                  secondary="Popis korisnika u vašem poduzeću"
                />
              </ListItem>
              <div className="members">
                <div>
                  <Avatar className="avatar">m</Avatar>
                  <Typography variant="body1">
                    {owner.email.split("@")[0]}
                  </Typography>
                  <Typography className="role" variant="body2">
                    Admin
                  </Typography>
                </div>
                <div>
                  <Avatar className="avatar">m</Avatar>
                  <Typography variant="body1">
                    {owner.email.split("@")[0]}
                  </Typography>
                  <Typography className="role" variant="body2">
                    Admin
                  </Typography>
                </div>
                <div>
                  <Avatar className="avatar">m</Avatar>
                  <Typography variant="body1">
                    {owner.email.split("@")[0]}
                  </Typography>
                  <Typography className="role" variant="body2">
                    Admin
                  </Typography>
                </div>
                <div>
                  <Avatar style={{ background: "#5E14FF" }} className="avatar">
                    <AddIcon />
                  </Avatar>
                  <Typography variant="body1">Dodajte račun</Typography>
                </div>
              </div>
              <Divider variant="middle" />
              <ListItem button>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Računi"
                  secondary="Promjenite role računa"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Podrška"
                  secondary="Kontaktirajte nas za pomoć pri korištenju aplikacije"
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem button>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Dokumentacija"
                  secondary="Pretražite dokumentaciju korištenja aplikacije"
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem button>
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Povratna informacija"
                  secondary="Pošaljite nam povratnu informaciju"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
