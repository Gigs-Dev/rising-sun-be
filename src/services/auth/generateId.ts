export const generateAcctID = (): string => {
    const acctAlias = 'DEM';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
  
    for (let i = 0; i < 6; i++) {
      if (i === 3) {
        randomPart += '-';
      }
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return `${acctAlias}-${randomPart}`;
};
