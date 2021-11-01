import Input from '@/models/input';
import Form from '@/models/form';

import { dbConnect } from '@/middleware/db';

const editHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'PUT') {
    const { dataObj, form: _id, owner, title, page } = req.body;
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
      title,
      archived: false,
    })
      .limit(12)
      .skip(12 * (page - 1))
      .populate({
        path: 'inputs',
        populate: {
          path: 'type',
        },
      });
    res.send(forms);
  }
};

export default editHandler;
