import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  team?: mongoose.Types.ObjectId;
  points: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, min: 8, max: 100 },
    fitnessLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, default: 0 },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export interface ITeam extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  score: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    score: { type: Number, default: 0 },
    color: { type: String, default: '#4F46E5' },
  },
  { timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  type: 'Running' | 'Walking' | 'Strength' | 'Cycling' | 'Yoga';
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    type: {
      type: String,
      enum: ['Running', 'Walking', 'Strength', 'Cycling', 'Yoga'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Activity =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);

export interface ILeaderboardEntry extends Document {
  user: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  score: number;
  rank: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, default: 0 },
    rank: { type: Number, min: 1, default: 1 },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const LeaderboardEntry =
  mongoose.models.LeaderboardEntry ||
  mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);

export interface IWorkout extends Document {
  title: string;
  description: string;
  type: 'Cardio' | 'Strength' | 'Mobility' | 'HIIT';
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusArea: string;
  equipment: string[];
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['Cardio', 'Strength', 'Mobility', 'HIIT'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 10 },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    focusArea: { type: String, required: true },
    equipment: [{ type: String }],
  },
  { timestamps: true }
);

export const Workout =
  mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
