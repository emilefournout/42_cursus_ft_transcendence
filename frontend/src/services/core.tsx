export const testing = `${process.env.REACT_APP_TESTING}` === "true";

export const devlog = (message: string) => {
  if (testing) console.log(message);
};
