import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import Tooltip from "@material-ui/core/Tooltip";

export const CardItem = ({ form, onOpen, onClose, showBack, types, owner }) => {
  const router = useRouter();
  const id = form._id;
  const archiveHandler = () => {
    if (owner.delete) {
      axios.get(`/api/archive/${id}`).then(router.push("/all-items"));
    }
  };
  const unArchiveHandler = () => {
    if (owner.delete) {
      axios.post(`/api/archive/${id}`).then(router.push("/all-items/archived"));
    }
  };
  const deleteHandler = () => {
    if (owner.delete) {
      axios.delete(`/api/crud/${id}`).then(router.push("/all-items"));
    }
  };

  return (
    <Card onClick={onOpen} className={!showBack ? "card" : null}>
      <CardContent>
        {form.inputs.map((input, index) => (
          <Typography className="card-content" variant="body1" key={input._id}>
            {types[index].name}: <span className="value">{input.value}</span>
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        {showBack && (
          <Tooltip title="Nazad">
            <IconButton onClick={onClose}>
              <KeyboardBackspaceIcon />
            </IconButton>
          </Tooltip>
        )}
        <span style={{ marginLeft: "auto" }}>
          {owner.create && (
            <Tooltip title="Promjeni">
              <IconButton
                style={{ zIndex: 7 }}
                onClick={() => router.push(`/all-items/${form._id}/edit`)}
                className="edit"
              >
                <EditIcon className="edit" />
              </IconButton>
            </Tooltip>
          )}
          {showBack && owner.delete && (
            <>
              {form.archived ? (
                <Tooltip title="Vrati iz arhiva">
                  <IconButton onClick={unArchiveHandler}>
                    <UnarchiveIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Arhiviraj">
                  <IconButton onClick={archiveHandler}>
                    <ArchiveIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Obriši">
                <IconButton onClick={deleteHandler}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </span>
      </CardActions>
    </Card>
  );
};
