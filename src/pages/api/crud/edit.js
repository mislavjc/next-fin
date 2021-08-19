import Input from '@/models/input';
import Form from '@/models/form';

import { dbConnect } from '@/middleware/db';

const editHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'PUT') {
    const { dataObj, form: _id, owner } = req.body;
    const form = await Form.findOne({ _id }).populate({
      path: 'inputs',
      populate: {
        path: 'type',
      },
    });
    for (let i = 0; i < form.inputs.length; i++) {
      const newVal = dataObj[form.inputs[i]._id];
      const input = await Input.findByIdAndUpdate(form.inputs[i]._id, {
        value: newVal,
      });
      await input.save();
    }
    await form.save();
    const forms = await Form.find({
      option: owner.option,
      archived: false,
    }).populate({
      path: 'inputs',
      populate: {
        path: 'type',
      },
    });
    res.send(forms);
  }
};

export default editHandler;
