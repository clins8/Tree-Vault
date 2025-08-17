import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlantUploadSchema } from "@shared/schema";
import multer from "multer";
import crypto from "crypto";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

function generateImageHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function mockPlantVerification(): 'success' | 'not_plant' | 'duplicate' {
  const rand = Math.random();
  if (rand < 0.6) return 'success';
  if (rand < 0.9) return 'not_plant';
  return 'duplicate';
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current user (demo user)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("23bsc005");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Upload plant image for verification
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageHash = generateImageHash(req.file.buffer);
      
      // Check for duplicate
      const existingUpload = await storage.getPlantUploadByHash(imageHash);
      if (existingUpload) {
        return res.json({
          success: false,
          status: 'duplicate',
          message: 'Duplicate not allowed',
          points: 0
        });
      }

      // Get current user
      const user = await storage.getUserByUsername("23bsc005");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Mock AI verification (replace with real AI service)
      const verificationStatus = mockPlantVerification();
      
      if (verificationStatus === 'duplicate') {
        return res.json({
          success: false,
          status: 'duplicate',
          message: 'Duplicate not allowed',
          points: 0
        });
      }

      const pointsAwarded = verificationStatus === 'success' ? 50 : 0;
      
      // Create plant upload record
      const upload = await storage.createPlantUpload({
        userId: user.id,
        imageHash,
        fileName: req.file.originalname,
        verificationStatus,
        pointsAwarded,
        location: req.body.location ? JSON.parse(req.body.location) : null,
      });

      // Update user points if successful
      if (verificationStatus === 'success') {
        await storage.updateUserPoints(user.id, pointsAwarded);
      }

      const messages = {
        success: '🌱 Plant Verified!',
        not_plant: 'Plant not recognised, try again',
        duplicate: 'Duplicate not allowed'
      };

      res.json({
        success: verificationStatus === 'success',
        status: verificationStatus,
        message: messages[verificationStatus],
        points: pointsAwarded,
        upload
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Upload failed. Please try again." 
      });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const topUsers = await storage.getTopUsers(10);
      res.json(topUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Get user's uploads
  app.get("/api/user/uploads", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("23bsc005");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const uploads = await storage.getUserUploads(user.id);
      res.json(uploads);
    } catch (error) {
      res.status(500).json({ message: "Failed to get uploads" });
    }
  });

  // Get recent discoveries
  app.get("/api/discoveries", async (req, res) => {
    try {
      const discoveries = await storage.getRecentUploads(10);
      res.json(discoveries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get discoveries" });
    }
  });

  // Get global stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGlobalStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
