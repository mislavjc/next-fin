import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import IconButton from "@material-ui/core/IconButton";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";

export const CardItem = ({ form }) => {
  const router = useRouter();
  const id = form._id;
  const clickHandler = () => {
    router.push(`/all-items/${form._id}`);
  };
  const archiveHandler = () => {
    axios.get(`/api/archive/${id}`).then(router.push("/all-items"));
  };
  const unArchiveHandler = () => {
    axios.post(`/api/archive/${id}`).then(router.push("/all-items/archived"));
  }
  const deleteHandler = () => {
    axios.delete(`/api/crud/${id}`).then(router.push("/all-items"));
  };

  return (
    <Card>
      <CardContent>
        {form.inputs.map((input) => (
          <Typography className="card-content" variant="body1" key={input._id}>
            {input.type.name}: {input.value}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        {router.pathname === "/all-items/[item]" ? (
          <IconButton onClick={() => router.back()}>
            <KeyboardBackspaceIcon />
          </IconButton>
        ) : (
          <IconButton onClick={clickHandler}>
            <MoreHorizIcon />
          </IconButton>
        )}
        <IconButton onClick={() => router.push(`/all-items/${form._id}/edit`)}>
          <EditIcon />
        </IconButton>
        <span style={{ marginLeft: "auto" }}>
          {form.archived ? (
            <IconButton onClick={unArchiveHandler}>
              <UnarchiveIcon />
            </IconButton>
          ) : (
            <IconButton onClick={archiveHandler}>
              <ArchiveIcon />
            </IconButton>
          )}
          <IconButton onClick={deleteHandler}>
            <DeleteIcon />
          </IconButton>
        </span>
      </CardActions>
    </Card>
  );
};
