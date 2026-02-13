import { Request, Response } from "express";
import User from "../../models/user.model";
import { sendResponse } from "../../utils/sendResponse";


export const getUsers = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const filter: any = {};

    if (type === 'active') {
      filter.isBanned = false;
    }

    if (type === 'banned') {
      filter.isBanned = true;
    }

    const [users, totalUsers, activeUsers, bannedUsers] =
      await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).select('-password'),
        User.countDocuments(),
        User.countDocuments({ isBanned: false }),
        User.countDocuments({ isBanned: true }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        stats: {
          totalUsers,
          activeUsers,
          bannedUsers,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};


export const banUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isBanned: false },
      {
        isBanned: true,
        bannedAt: new Date(),
        bannedBy: req.user.id,
      },
      { new: true }
    );

    if (!user) {
      return sendResponse(res, 400, false, 'User not found or already suspended');
    }

    return sendResponse(res, 200, true, 'User has been suspended');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Failed to suspend user');
  }
};


export const unBanUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isBanned: false },
      {
        isBanned: false,
        bannedAt: new Date(),
        bannedBy: req.user.id,
      },
      { new: true }
    );

    if (!user) {
      return sendResponse(res, 400, false, 'User not found or not suspended');
    }

    return sendResponse(res, 200, true, 'User has been unbanned');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Failed to unban user');
  }
};

