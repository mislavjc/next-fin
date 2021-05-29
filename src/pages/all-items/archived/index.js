import { getSession } from "next-auth/client";
import { dbConnect } from "@/middleware/db";
import Form from "@/models/form";
import User from "@/models/user";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { CardItem } from "@/components/CardItem";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.01,
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

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
  const forms = await Form.find({ owner: owner._id, archived: true }).populate({
    path: "inputs",
    populate: {
      path: "type",
    },
  });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      forms: JSON.parse(JSON.stringify(forms)),
    },
  };
}

export default function archivedItems({ forms }) {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center">Arhivirani unosi</Typography>
      <Grid container spacing={4}>
        <AnimateSharedLayout>
          <AnimatePresence>
            {forms.map((form, index) => (
              <Grid item xs={12} md={6} lg={4} key={form._id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  layoutId={form._id}
                >
                  <CardItem form={form} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </AnimateSharedLayout>
      </Grid>
    </Container>
  );
}
