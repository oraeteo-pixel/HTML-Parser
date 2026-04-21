import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePassword(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export type SafeUser = Omit<User, "passwordHash">;

function stripPassword(user: User): SafeUser {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export interface IAuthStorage {
  getUser(id: string): Promise<SafeUser | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<SafeUser>;
  createLocalUser(email: string, password: string, firstName: string, phone?: string): Promise<SafeUser>;
  verifyLocalPassword(email: string, password: string): Promise<SafeUser | null>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<SafeUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? stripPassword(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<SafeUser> {
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
    return stripPassword(user);
  }

  async createLocalUser(email: string, password: string, firstName: string, phone?: string): Promise<SafeUser> {
    const passwordHash = await hashPassword(password);
    const id = randomUUID();
    await db.insert(users).values({ id, email, passwordHash, firstName, phone, createdAt: new Date(), updatedAt: new Date() });
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return stripPassword(user);
  }

  async verifyLocalPassword(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.passwordHash) return null;
    const valid = await comparePassword(password, user.passwordHash);
    return valid ? stripPassword(user) : null;
  }
}

export const authStorage = new AuthStorage();
