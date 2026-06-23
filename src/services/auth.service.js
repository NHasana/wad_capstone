const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const config = require("../config");
const userRepository = require("../repositories/user.repository");
const refreshTokenRepository = require("../repositories/refreshToken.repository");

const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await argon2.hash(password);

  return userRepository.create({
    name,
    email,
    password: hashedPassword,
  });
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user || !(await argon2.verify(user.password, password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role }, // ← tambah role
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  await refreshTokenRepository.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken, user };
};

const refresh = async (tokenString) => {
  const storedToken = await refreshTokenRepository.findByToken(tokenString);
  if (storedToken && storedToken.isRevoked) {
    await refreshTokenRepository.revokeAllByUser(storedToken.userId);
    throw new Error("TOKEN_REUSE_DETECTED");
  }
  if (!storedToken) throw new Error("INVALID_REFRESH_TOKEN");

  await refreshTokenRepository.revoke(storedToken.id);

  const accessToken = jwt.sign(
    { userId: storedToken.user.id, email: storedToken.user.email, role: storedToken.user.role }, // ← tambah role
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  const newRefreshToken = jwt.sign(
    { id: storedToken.user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  await refreshTokenRepository.create({
    token: newRefreshToken,
    userId: storedToken.user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (tokenString) => {
  const token = await refreshTokenRepository.findByToken(tokenString);
  if (token) await refreshTokenRepository.revoke(token.id);
};

module.exports = { register, login, refresh, logout };