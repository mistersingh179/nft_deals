const sleep = async duration => {
  console.log("starting to sleep for: ", duration);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("finished sleeping");
      resolve();
    }, duration);
  });
};

export default sleep;
