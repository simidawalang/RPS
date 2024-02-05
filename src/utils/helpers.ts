declare global {
  interface Window {
    ethereum?: any;
  }
  
}


export const formatTime = (time: any) => {
  const _time = new Date(parseInt(time, 10));

  const formattedTime =
    `${Number(_time.getHours()) < 10 ? '0' : ''}` +
    _time.getHours() +
    `:${Number(_time.getMinutes()) < 10 ? '0' : ''}` +
    _time.getMinutes();

  return formattedTime;
};
