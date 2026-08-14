const { User, Profile } = require("../models");

async function getProfile(userId) {

    const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email"],
        include: [
            {
                model: Profile,
                attributes: [
                    "phone",
                    "location",
                    "careerGoal",
                    "experienceLevel"
                ]
            }
        ]
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
}


async function updateProfile(userId, profileData) {

    const profile = await Profile.findOne({
        where: { userId }
    });

    if (!profile) {
        const error = new Error("Profile not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = [
        "name",
        "phone",
        "location",
        "careerGoal",
        "experienceLevel"
    ];

    const updates = {};

    for (const field of allowedFields) {

        if (profileData[field] !== undefined) {
            updates[field] = profileData[field];
        }

    }

    await profile.update(updates);

    return profile;
}

module.exports = {
    getProfile,
    updateProfile
}