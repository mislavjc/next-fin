import dayjs from 'dayjs';

import Form from '@/models/form';

import { dbConnect } from '@/middleware/db';

const statisticsHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { owner, title, archived } = req.body;
    const forms = await Form.find({
      option: owner.option,
      archived: false,
      title,
    }).populate({
      path: 'inputs',
      populate: {
        path: 'type',
      },
    });

    const wrapper = {};
    const tempData = {};
    for (let form of forms) {
      let count = 0;
      let value;
      for (let input of form.inputs) {
        if (input.type.type === 'date') {
          value = dayjs(input.value).format('DD.MM.YYYY');
        } else {
          value = input.value;
        }
        if (!wrapper.hasOwnProperty(input.type.name))
          wrapper[input.type.name] = {};
        if (tempData.hasOwnProperty(value)) {
          count++;
        } else {
          count = 1;
        }
        if (wrapper[input.type.name].hasOwnProperty(value)) {
          wrapper[input.type.name][value] = count++;
        } else {
          wrapper[input.type.name][value] = count;
        }
        tempData[value] = count;
      }
    }
    const dataArr = [];

    for (const [key, value] of Object.entries(wrapper)) {
      const objData = Object.keys(value).map((key) => {
        return value[key];
      });
      const graphData = {
        labels: Object.keys(value),
        datasets: [
          {
            label: '# unosa',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            data: objData,
          },
        ],
      };
      const graphOptions = {
        ...options,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: key,
          },
        },
      };
      dataArr.push({ graphData, graphOptions });
    }
    res.send(dataArr);
  }
};

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
};

export default statisticsHandler;
