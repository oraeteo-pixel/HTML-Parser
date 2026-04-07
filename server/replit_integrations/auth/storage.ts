import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || randomUUID();
    const dataWithId = { ...userData, id };

    await db
      .insert(users)
      .values(dataWithId)
      .onDuplicateKeyUpdate({
        set: {
          email: dataWithId.email,
          firstName: dataWithId.firstName,
          lastName: dataWithId.lastName,
          profileImageUrl: dataWithId.profileImageUrl,
          phone: dataWithId.phone,
          updatedAt: new Date(),
        },
      });

    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
}

export const authStorage = new AuthStorage();
