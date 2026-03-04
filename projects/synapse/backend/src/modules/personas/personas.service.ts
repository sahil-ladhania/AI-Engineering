import { Persona } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const getAllPersonasService = async (): Promise<Persona[]> => {
  return prisma.persona.findMany({
    orderBy: { id: "asc" },
  });
};

export const getPersonaByIdService = async (id: string): Promise<Persona | null> => {
  return prisma.persona.findUnique({
    where: { id },
  });
};
