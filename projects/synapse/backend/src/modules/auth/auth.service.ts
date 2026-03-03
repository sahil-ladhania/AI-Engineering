import { User } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const checkIfUserExist = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: { 
      email 
    },
  });

  return user;
};

export const registerUser = async ({ name, email, password }: { name: string; email: string; password: string }): Promise<User> => {
  const user = await prisma.user.create({
    data: { 
      name, 
      email, 
      password 
    },
  });

  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { 
      id 
    },
  });

  return user;
};