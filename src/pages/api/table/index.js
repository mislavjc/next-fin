import Form from '@/models/form';
import Type from '@/models/type';

import { dbConnect } from '@/middleware/db';

const tableHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { owner, title } = req.body;
    const forms = await Form.find({ option: owner.option, title }).populate({
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
    res.send({ columns, rows });
  }
};

export default tableHandler;
