import { useState } from 'react';
import { getSession } from 'next-auth/client';

import Container from '@mui/material/Container';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { CollectionSelect } from '@/components/CollectionSelect';

import User from '@/models/user';
import Form from '@/models/form';
import Type from '@/models/type';
import Input from '@/models/input';
import Option from '@/models/option';

import { dbConnect } from '@/middleware/db';

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
  const option = await Option.findById(owner.option);
  const forms = await Form.find({ option: owner.option }).populate({
    path: 'inputs',
    populate: {
      path: 'type',
    },
  });
  const types = await Type.find({ option: owner.option });

  const columns = {};

  for (let type of types) {
    if (!columns.hasOwnProperty(type.title)) {
      columns[type.title] = [
        { field: type.name, headerName: type.name, width: 160 },
      ];
    } else {
      columns[type.title].push({
        field: type.name,
        headerName: type.name,
        width: 160,
      });
    }
  }

  const rows = {};

  for (let [index, form] of forms.entries()) {
    if (!rows.hasOwnProperty(form.title)) {
      rows[form.title] = [];
    }
    const rowObj = { id: index };
    for (let input of form.inputs) {
      rowObj[input.type.name] = input.value;
    }
    rows[form.title].push(rowObj);
  }

  const inputs = await Input.find(
    { option: owner.option },
    { type: 1, value: 1 }
  );

  const relatedInputs = {};

  for (let type of types) {
    if (type.type === 'relation') {
      relatedInputs[type._relation] = [];
      for (let input of inputs) {
        if (JSON.stringify(input.type) === JSON.stringify(type._relation)) {
          relatedInputs[type._relation].push(input.value);
        }
      }
      relatedInputs[type._relation] = [
        ...new Set(relatedInputs[type._relation]),
      ];
    }
  }
  return {
    props: {
      option: JSON.parse(JSON.stringify(option)),
      columns,
      rows,
    },
  };
}

export default function TablePage({ option, columns, rows }) {
  const [selectedTitle, setSelectedTitle] = useState(
    option ? option.titles[0] : ''
  );

  useEffect(() => {
    axios
      .post('/api/crud/read', {
        title: selectedTitle,
        owner,
        archived: false,
      })
      .then((res) => {
        setEntries(res.data.forms);
        setColumnTypes(res.data.types);
        setPaginationCount(Math.ceil(res.data.formCount / 12));
        setFormCount(res.data.formCount);
      })
      .then(() => setDataObj({}))
      .then(() => localStorage.setItem('selectedTitle', selectedTitle));
  }, [selectedTitle]);

  useEffect(() => {
    if (localStorage.getItem('selectedTitle')) {
      setSelectedTitle(localStorage.getItem('selectedTitle'));
    }
  }, []);

  return (
    <Container maxWidth="xl">
      {option && (
        <CollectionSelect
          option={option}
          value={selectedTitle}
          onChange={setSelectedTitle}
        />
      )}
      <div style={{ overflowX: 'scroll' }}>
        <DataGrid
          rows={rows[selectedTitle]}
          columns={columns[selectedTitle]}
          pageSize={24}
          rowsPerPageOptions={[24]}
          autoHeight
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </Container>
  );
}
