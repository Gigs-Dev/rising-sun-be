import User from "../../model/user.model";


export const generateAcctID = async (): Promise<string> => {
    const acctAlias = 'REA';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    let randomPart: string;
    let newAcctID: string;

    do {
        randomPart = '';
        for (let i = 0; i < 6; i++) {
            if (i === 3) {
                randomPart += '-';
            }
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newAcctID = `${acctAlias}-${randomPart}`;
    } while (await User.exists({ acctId: newAcctID }));

    return newAcctID;
};


export const generateReferalId = async (email: string): Promise<string> => {
  const emailPrefix = email.slice(0, 3).toUpperCase(); 
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); 
  
  let referalId = `${emailPrefix}${randomPart}`;

  // Ensure the referalId is unique
  while (await User.exists({ referalId })) {
      referalId = `${emailPrefix}${Math.floor(1000 + Math.random() * 9000).toString()}`;
  }

  return referalId;
};


// export const generateAcctID = (): string => {
//     const acctAlias = 'REA';
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let randomPart = '';
  
//     for (let i = 0; i < 6; i++) {
//       if (i === 3) {
//         randomPart += '-';
//       }
//       randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
  
//     return `${acctAlias}-${randomPart}`;
// };
