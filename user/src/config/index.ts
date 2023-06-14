import dotenv from 'dotenv';

dotenv.config();

const config = {
  secret: {
    access: process.env.ACCESS_TOKEN_SECRET as string,
    refresh: process.env.REFRESH_TOKEN_SECRET as string,
  },
};

export default config;
