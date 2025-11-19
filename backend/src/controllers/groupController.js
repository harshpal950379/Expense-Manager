const Group = require('../models/Group');
const SharedExpense = require('../models/SharedExpense');
const User = require('../models/User');

// @route   POST /api/groups
// @desc    Create group
const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Add creator to members if not already there
    const groupMembers = [req.userId];
    if (members && Array.isArray(members)) {
      members.forEach((memberId) => {
        if (!groupMembers.includes(memberId)) {
          groupMembers.push(memberId);
        }
      });
    }

    const group = await Group.create({
      name,
      description: description || '',
      createdBy: req.userId,
      members: groupMembers,
    });

    await group.populate('createdBy', 'name email');
    await group.populate('members', 'name email');

    res.status(201).json({
      success: true,
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/groups
// @desc    Get all groups for user
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userId })
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/groups/:id
// @desc    Get single group
const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member
    if (!group.members.some((m) => m._id.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get shared expenses for this group
    const sharedExpenses = await SharedExpense.find({ group: req.params.id })
      .populate('paidBy', 'name email')
      .populate('splits.userId', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      group,
      sharedExpenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/groups/:id
// @desc    Update group
const updateGroup = async (req, res) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Only creator can update
    if (group.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only creator can update group' });
    }

    const { name, description } = req.body;

    group = await Group.findByIdAndUpdate(
      req.params.id,
      {
        name: name || group.name,
        description: description !== undefined ? description : group.description,
      },
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/groups/:id/members
// @desc    Add member to group
const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Only creator can add members
    if (group.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only creator can add members' });
    }

    // Check if member already exists
    if (group.members.some((m) => m.toString() === memberId)) {
      return res.status(400).json({ message: 'Member already in group' });
    }

    // Verify member exists
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    group.members.push(memberId);
    await group.save();

    await group.populate('createdBy', 'name email');
    await group.populate('members', 'name email');

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/groups/:id/members/:memberId
// @desc    Remove member from group
const removeMember = async (req, res) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Only creator can remove members
    if (group.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only creator can remove members' });
    }

    const { memberId } = req.params;

    group.members = group.members.filter((m) => m.toString() !== memberId);
    await group.save();

    await group.populate('createdBy', 'name email');
    await group.populate('members', 'name email');

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/groups/:id
// @desc    Delete group
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Only creator can delete
    if (group.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only creator can delete group' });
    }

    await Group.findByIdAndDelete(req.params.id);
    await SharedExpense.deleteMany({ group: req.params.id });

    res.status(200).json({ success: true, message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  addMember,
  removeMember,
  deleteGroup,
};
