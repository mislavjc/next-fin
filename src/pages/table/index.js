import { useState } from 'react';
import { dbConnect } from '@/middleware/db';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import User from '@/models/user';
import Form from '@/models/form';
import Type from '@/models/type';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import { Toolbar } from '@/components/Toolbar';
import dayjs from 'dayjs';

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
    context.res.end();
    return {
      props: {
        forms: false,
      },
    };
  }
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const forms = await Form.find({ option: owner.option }).populate({
    path: 'inputs',
    populate: {
      path: 'type',
    },
  });
  const types = await Type.find({ option: owner.option });
  return {
    props: {
      forms: JSON.parse(JSON.stringify(forms)),
      types: JSON.parse(JSON.stringify(types)),
      owner: JSON.parse(JSON.stringify(owner)),
    },
  };
}

export default function StickyHeadTable({ forms, types, owner }) {
  const router = useRouter();
  const columns = [];
  for (let i = 0; i < types.length; i++) {
    columns.push(types[i]);
  }

  const rows = [];

  for (let form of forms) {
    const data = [];
    for (let i = 0; i < form.inputs.length; i++) {
      data.push(form.inputs[i].value);
    }
    const rowObj = {
      id: form._id,
      value: data,
    };
    rows.push(rowObj);
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [search, setSearch] = useState('');

  return (
    <Container maxWidth="lg">
      <Toolbar search={search} setSearch={setSearch} owner={owner} />
      <Paper>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column._id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => router.push(`/all-items/${row.id}`)}
                    >
                      {columns.map((column, index) => {
                        const value = row.value[index];
                        return (
                          <TableCell key={index}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : column.type === 'date'
                              ? dayjs(value).format('DD.MM.YYYY')
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}
