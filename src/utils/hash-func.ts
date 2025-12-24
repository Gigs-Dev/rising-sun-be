import bcrypt from "bcrypt";

export const doHash = (value: string, saltvalue: number) => {
    const result = bcrypt.hash(value, saltvalue);
    return result;
}


export const hashValidator = (value: string, hashedvalue: string) => {
    const result = bcrypt.compare(value, hashedvalue);
    return result;
}

