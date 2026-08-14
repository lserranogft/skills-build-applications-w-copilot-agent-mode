import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Ava Thompson',
        email: 'ava@example.com',
        age: 16,
        fitnessLevel: 'Advanced',
        points: 1420,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
      },
      {
        name: 'Noah Patel',
        email: 'noah@example.com',
        age: 17,
        fitnessLevel: 'Intermediate',
        points: 1260,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
      },
      {
        name: 'Mia Rodriguez',
        email: 'mia@example.com',
        age: 15,
        fitnessLevel: 'Intermediate',
        points: 1185,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
      },
      {
        name: 'Leo Nguyen',
        email: 'leo@example.com',
        age: 18,
        fitnessLevel: 'Beginner',
        points: 970,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
      },
    ]);

    const thunderTeam = await Team.create({
      name: 'Thunder Striders',
      description: 'Fast-footed runners focused on endurance and speed.',
      members: [users[0]._id, users[1]._id],
      score: 2680,
      color: '#f59e0b',
    });

    const novaTeam = await Team.create({
      name: 'Nova Lifters',
      description: 'Strength-first athletes working on power and recovery.',
      members: [users[2]._id, users[3]._id],
      score: 2155,
      color: '#10b981',
    });

    await User.updateMany(
      { _id: { $in: [users[0]._id, users[1]._id] } },
      { $set: { team: thunderTeam._id } }
    );
    await User.updateMany(
      { _id: { $in: [users[2]._id, users[3]._id] } },
      { $set: { team: novaTeam._id } }
    );

    const activities = await Activity.insertMany([
      {
        user: users[0]._id,
        team: thunderTeam._id,
        type: 'Running',
        durationMinutes: 35,
        distanceKm: 5.6,
        caloriesBurned: 420,
        date: new Date('2026-08-10T06:30:00Z'),
        notes: 'Tempo run with hill intervals.',
      },
      {
        user: users[1]._id,
        team: thunderTeam._id,
        type: 'Strength',
        durationMinutes: 45,
        caloriesBurned: 360,
        date: new Date('2026-08-11T17:15:00Z'),
        notes: 'Upper body strength session.',
      },
      {
        user: users[2]._id,
        team: novaTeam._id,
        type: 'Walking',
        durationMinutes: 50,
        distanceKm: 4.8,
        caloriesBurned: 290,
        date: new Date('2026-08-09T18:00:00Z'),
        notes: 'Recovery walk with mobility drills.',
      },
      {
        user: users[3]._id,
        team: novaTeam._id,
        type: 'Cycling',
        durationMinutes: 40,
        distanceKm: 12.4,
        caloriesBurned: 510,
        date: new Date('2026-08-12T07:45:00Z'),
        notes: 'Steady endurance ride.',
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        user: users[0]._id,
        team: thunderTeam._id,
        score: 1420,
        rank: 1,
        streak: 8,
      },
      {
        user: users[1]._id,
        team: thunderTeam._id,
        score: 1260,
        rank: 2,
        streak: 5,
      },
      {
        user: users[2]._id,
        team: novaTeam._id,
        score: 1185,
        rank: 3,
        streak: 6,
      },
      {
        user: users[3]._id,
        team: novaTeam._id,
        score: 970,
        rank: 4,
        streak: 3,
      },
    ]);

    await Workout.insertMany([
      {
        title: '5K Sprint Builder',
        description: 'A short interval workout to improve acceleration and stamina.',
        type: 'Cardio',
        durationMinutes: 30,
        difficulty: 'Intermediate',
        focusArea: 'Speed',
        equipment: ['Cones', 'Stopwatch'],
      },
      {
        title: 'Power Circuit',
        description: 'Resistance-based circuit emphasizing legs, core, and grip.',
        type: 'Strength',
        durationMinutes: 45,
        difficulty: 'Advanced',
        focusArea: 'Strength',
        equipment: ['Dumbbells', 'Bench'],
      },
      {
        title: 'Mobility Reset',
        description: 'Low-impact flow to improve flexibility and joint recovery.',
        type: 'Mobility',
        durationMinutes: 20,
        difficulty: 'Beginner',
        focusArea: 'Recovery',
        equipment: ['Yoga mat'],
      },
      {
        title: 'HIIT Burn',
        description: 'Alternating intensity intervals designed for quick calorie burn.',
        type: 'HIIT',
        durationMinutes: 25,
        difficulty: 'Intermediate',
        focusArea: 'Conditioning',
        equipment: ['Jump rope', 'Bodyweight'],
      },
    ]);

    console.log(`Seeded ${users.length} users, ${activities.length} activities, ${await Team.countDocuments()} teams, ${await LeaderboardEntry.countDocuments()} leaderboard entries, and ${await Workout.countDocuments()} workouts.`);
    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
