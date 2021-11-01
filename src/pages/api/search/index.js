import mongoose from 'mongoose';

import Form from '@/models/form';
import Type from '@/models/type';

import { dbConnect } from '@/middleware/db';
import { mapAndReduce } from '@/lib/filter';

const searchHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { search, option, title, page } = req.body;
    const query = search.map((s) => {
      return {
        $match: {
          'inputs.value': new RegExp(s),
          option: mongoose.Types.ObjectId(option),
        },
      };
    });

    if (search !== '' && !search.includes('+')) {
      const forms = await Form.aggregate([
        {
          $lookup: {
            from: 'inputs',
            localField: 'inputs',
            foreignField: '_id',
            as: 'inputs',
          },
        },
        ...query,
      ])
        .skip(12 * (page - 1))
        .limit(12);
      const result = await Type.populate(forms, { path: 'inputs.type' });

      const searchData = mapAndReduce(result)

      const formCount = await Form.aggregate([
        {
          $lookup: {
            from: 'inputs',
            localField: 'inputs',
            foreignField: '_id',
            as: 'inputs',
          },
        },
        ...query,
      ]);

      res.send({ forms: result, formCount: formCount.length, searchData });
    } else {
      const forms = await Form.find({
        option: owner.option,
        title,
        archived,
      })
        .limit(12)
        .populate({
          path: 'inputs',
          populate: {
            path: 'type',
          },
        });
      const formCount = await Form.countDocuments({
        option: owner.option,
        archived: false,
        title,
      });

      const searchData = mapAndReduce(forms);

      res.send({ forms, formCount, searchData });
    }
    res.status(200);
  }
};

export default searchHandler;
