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

export const generateRandomInteger = () => {
  const numBytes = 32; // 256 bits, since the hasher function takes in a uint256 salt
  if (typeof window !== 'undefined' && window.crypto) {
    // For browsers supporting the Web Crypto API

    const array = new Uint8Array(numBytes);
    window.crypto.getRandomValues(array);


    // Convert the byte array to a BigInt
    let randomBigInt = BigInt(0);
    for (let i = 0; i < numBytes; i++) {
      randomBigInt = (randomBigInt << BigInt(8)) | BigInt(array[i]);
    }

    return randomBigInt.toString();
  } 
};
