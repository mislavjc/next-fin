import Form from '@/models/form';

import { dbConnect } from '@/middleware/db';

const editHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { owner, title, archived } = req.body;
    const forms = await Form.find({
      option: owner.option,
      title,
      archived,
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
