const profileService = require("../services/profileService");

async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
