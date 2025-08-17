import { type User, type InsertUser, type PlantUpload, type InsertPlantUpload, type GlobalStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<User | undefined>;
  getTopUsers(limit: number): Promise<User[]>;

  // Plant upload operations
  createPlantUpload(upload: InsertPlantUpload): Promise<PlantUpload>;
  getPlantUploadByHash(hash: string): Promise<PlantUpload | undefined>;
  getUserUploads(userId: string): Promise<PlantUpload[]>;
  getRecentUploads(limit: number): Promise<PlantUpload[]>;

  // Global stats
  getGlobalStats(): Promise<GlobalStats>;
  updateGlobalStats(): Promise<GlobalStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private plantUploads: Map<string, PlantUpload>;
  private imageHashes: Set<string>;
  private globalStats: GlobalStats;

  constructor() {
    this.users = new Map();
    this.plantUploads = new Map();
    this.imageHashes = new Set();
    this.globalStats = {
      id: randomUUID(),
      totalTrees: 0,
      totalUsers: 0,
      totalPhotos: 0,
      countries: 1,
      updatedAt: new Date(),
    };

    // Create a demo user
    const demoUser: User = {
      id: randomUUID(),
      username: "23bsc005",
      points: 0,
      treesPlanted: 0,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      points: 0,
      treesPlanted: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    await this.updateGlobalStats();
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.points += points;
      if (points > 0) {
        user.treesPlanted += 1;
      }
      this.users.set(userId, user);
      await this.updateGlobalStats();
      return user;
    }
    return undefined;
  }

  async getTopUsers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }

  async createPlantUpload(upload: InsertPlantUpload): Promise<PlantUpload> {
    const id = randomUUID();
    const plantUpload: PlantUpload = {
      ...upload,
      id,
      location: upload.location ?? null,
      pointsAwarded: upload.pointsAwarded ?? 0,
      createdAt: new Date(),
    };
    this.plantUploads.set(id, plantUpload);
    this.imageHashes.add(upload.imageHash);
    await this.updateGlobalStats();
    return plantUpload;
  }

  async getPlantUploadByHash(hash: string): Promise<PlantUpload | undefined> {
    return Array.from(this.plantUploads.values()).find(
      (upload) => upload.imageHash === hash,
    );
  }

  async getUserUploads(userId: string): Promise<PlantUpload[]> {
    return Array.from(this.plantUploads.values())
      .filter((upload) => upload.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentUploads(limit: number): Promise<PlantUpload[]> {
    return Array.from(this.plantUploads.values())
      .filter((upload) => upload.verificationStatus === 'success')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return this.globalStats;
  }

  async updateGlobalStats(): Promise<GlobalStats> {
    this.globalStats.totalUsers = this.users.size;
    this.globalStats.totalPhotos = Array.from(this.plantUploads.values()).filter(
      (upload) => upload.verificationStatus === 'success'
    ).length;
    this.globalStats.totalTrees = Array.from(this.users.values()).reduce(
      (sum, user) => sum + user.treesPlanted, 0
    );
    this.globalStats.updatedAt = new Date();
    return this.globalStats;
  }
}

export const storage = new MemStorage();
