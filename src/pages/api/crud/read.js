import Form from '@/models/form';

import { dbConnect } from '@/middleware/db';

const editHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { owner, title } = req.body;
    const forms = await Form.find({
      option: owner.option,
      title,
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
