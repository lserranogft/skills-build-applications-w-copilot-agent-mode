import { Router } from 'express';
import { Activity } from '../models';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const activities = await Activity.find().populate('user team').sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('user team');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    return res.json(activity);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch activity', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create activity', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user team');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    return res.json(activity);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update activity', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    return res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete activity', error });
  }
});

export default router;
