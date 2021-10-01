import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import dayjs from 'dayjs';

export const CardItem = ({
  form,
  onOpen,
  onClose,
  showBack,
  owner,
  setShowEditForm,
  setInitialValue,
}) => {
  const router = useRouter();
  const id = form._id;
  const archiveHandler = () => {
    if (owner.delete) {
      axios
        .get(`/api/archive/${id}`)
        .then(router.reload(window.location.pathname));
    }
  };
  const unArchiveHandler = () => {
    if (owner.delete) {
      axios
        .post(`/api/archive/${id}`)
        .then(router.reload(window.location.pathname));
    }
  };
  const deleteHandler = () => {
    if (owner.delete) {
      axios.delete(`/api/crud/${id}`).then(router.reload(window.location.pathname));
    }
  };

  const editHandler = () => {
    setInitialValue(form);
    setShowEditForm(true);
  };

  return (
    <Paper className="overscroll-card">
      <List>
        {form.inputs.map((input) => {
          if (input.type) {
            return (
              <span key={input._id}>
                <ListItem
                  button
                  onClick={onOpen}
                  className={!showBack ? 'card' : null}
                >
                  <span
                    style={{
                      overflowWrap: 'break-word',
                      width: '25%',
                    }}
                  >
                    <Typography variant="overline">
                      {input.type.name}
                    </Typography>
                  </span>
                  <Divider orientation="vertical" flexItem />
                  <Typography
                    variant="body1"
                    style={{
                      overflowWrap: 'break-word',
                      width: '75%',
                      paddingLeft: '0.5rem',
                    }}
                  >
                    {input.type.currency === '£' ? input.type.currency : null}{' '}
                    {input.type.type === 'date'
                      ? dayjs(input.value).format('DD.MM.YYYY')
                      : input.value}{' '}
                    {input.type.currency !== '£' ? input.type.currency : null}
                  </Typography>
                </ListItem>
                <Divider />
              </span>
            );
          }
        })}
        {showBack &&
          form.attachments.length > 0 &&
          form.attachments.map((attachment) => (
            <ListItem key={attachment.filename}>
              {attachment.url.slice(attachment.url.length - 3) === 'pdf' ? (
                <iframe
                  height="450px"
                  width="100%"
                  src={attachment.url}
                  type="application/pdf"
                />
              ) : (
                <Image
                  src={attachment.url}
                  alt={attachment.filename}
                  style={{ maxWidth: '100%', maxHeight: '450px' }}
                />
              )}
            </ListItem>
          ))}
        <ListItem>
          {showBack && (
            <Tooltip title="Nazad">
              <IconButton onClick={onClose}>
                <KeyboardBackspaceIcon />
              </IconButton>
            </Tooltip>
          )}
          <span style={{ marginLeft: 'auto' }}>
            {owner.create && (
              <Tooltip title="Promjeni">
                <IconButton onClick={editHandler} className="edit">
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
        </ListItem>
      </List>
    </Paper>
  );
};
