import { Router } from 'express';
import { Workout } from '../models';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const workouts = await Workout.find().sort({ difficulty: 1, durationMinutes: 1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workouts', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    return res.json(workout);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch workout', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create workout', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    return res.json(workout);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update workout', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    return res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete workout', error });
  }
});

export default router;
