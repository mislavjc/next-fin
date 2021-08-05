export const cardVariants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.01,
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export const formVariants = {
  hidden: {
    y: -50,
    opcatiy: 0,
  },
  visible: {
    y: 0,
    opcatiy: 1,
  },
  exit: {
    y: -50,
    opacity: 0,
  },
};

export const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const inputVariants = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      stiffness: 100,
    },
  },
};