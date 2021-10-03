import axios from 'axios';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

export const CardItem = ({
  form,
  onOpen,
  onClose,
  showBack,
  owner,
  setShowEditForm,
  setInitialValue,
  columnTypes,
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
      axios
        .delete(`/api/crud/${id}`)
        .then(router.reload(window.location.pathname));
    }
  };

  const editHandler = () => {
    setInitialValue(form);
    setShowEditForm(true);
  };

  return (
    <Paper className="overscroll-card">
      <List>
        {form.inputs.map((input, index) => {
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
                      {columnTypes[index].name}
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
                    {columnTypes[index].currency === '£'
                      ? columnTypes[index].currency
                      : null}{' '}
                    {columnTypes[index].type === 'date'
                      ? dayjs(input.value).format('DD.MM.YYYY')
                      : input.value}{' '}
                    {columnTypes[index].currency !== '£'
                      ? columnTypes[index].currency
                      : null}
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
