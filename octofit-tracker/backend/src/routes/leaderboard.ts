import { Router } from 'express';
import { LeaderboardEntry, User, Team } from '../models';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const leaderboard = await LeaderboardEntry.find()
      .populate('user')
      .populate('team')
      .sort({ score: -1, streak: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const entry = await LeaderboardEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create leaderboard entry', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const entry = await LeaderboardEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user team');
    if (!entry) {
      return res.status(404).json({ message: 'Leaderboard entry not found' });
    }
    return res.json(entry);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update leaderboard entry', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const entry = await LeaderboardEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Leaderboard entry not found' });
    }
    return res.json({ message: 'Leaderboard entry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete leaderboard entry', error });
  }
});

export default router;
