export const generateVerifyUrl = (registrationNumber: string) => {
  return `https://verify.link/verification/${registrationNumber}`;
};