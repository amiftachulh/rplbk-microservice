import jwt from 'jsonwebtoken';
import config from '../config';

export function generateAccessToken(data: any) {
  return jwt.sign(data, config.secret.access, {
    algorithm: 'HS256',
    expiresIn: '5m',
  });
}

export function generateRefreshToken(data: any) {
  return jwt.sign(data, config.secret.refresh, {
    algorithm: 'HS256',
    expiresIn: '7d',
  });
}

export function verifyAccessToken(accessToken: string) {
  try {
    return jwt.verify(accessToken, config.secret.access) as { id: number };
  } catch (error) {
    return false;
  }
}

export function verifyRefreshToken(refreshToken: string) {
  try {
    jwt.verify(refreshToken, config.secret.refresh);
    return true;
  } catch (error) {
    return false;
  }
}
