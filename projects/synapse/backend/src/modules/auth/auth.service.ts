import { User } from "@prisma/client";

export const registerUser = async (_data: {
  email: string;
  password: string;
  name?: string;
}): Promise<User> => {
  // 1. Check if a user with _data.email already exists:
  //    prisma.user.findUnique({ where: { email: _data.email } })
  //    - If found → throw new Error("Email already in use") with statusCode 409
  // 2. Hash the plain-text password:
  //    bcrypt.hash(_data.password, 12)
  // 3. Create the user in the DB:
  //    prisma.user.create({ data: { email, password: hashedPassword, name } })
  // 4. Return the created user record
  throw new Error("Not implemented");
};

export const loginUser = async (
  _email: string,
  _password: string
): Promise<{ user: User; token: string }> => {
  // 1. Look up user by email:
  //    prisma.user.findUnique({ where: { email: _email } })
  //    - If not found → throw new Error("Invalid credentials") with statusCode 401
  //      (use a generic message — do NOT reveal whether email or password was wrong)
  // 2. Compare plain-text password against stored hash:
  //    bcrypt.compare(_password, user.password)
  //    - If mismatch → throw new Error("Invalid credentials") with statusCode 401
  // 3. Sign a JWT:
  //    jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  // 4. Return { user, token }
  throw new Error("Not implemented");
};

export const getUserById = async (
  _id: string
): Promise<User | null> => {
  // 1. Query DB for user by primary key:
  //    prisma.user.findUnique({ where: { id: _id } })
  // 2. Return the user record, or null if not found
  throw new Error("Not implemented");
};
