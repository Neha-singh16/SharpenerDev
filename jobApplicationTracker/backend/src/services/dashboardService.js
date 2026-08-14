const { Application, Company } = require("../models");

const { Op } = require("sequelize");

async function getDashboard(userId) {
  // 1. Total applications

  const totalApplications = await Application.count({
    where: {
      userId,
    },
  });

  // 2. Count applications by status

  const statuses = ["APPLIED", "INTERVIEW", "OFFERED", "REJECTED"];

  const statusCounts = {};

  for (const status of statuses) {
    statusCounts[status] = await Application.count({
      where: {
        userId,
        status,
      },
    });
  }

  // 3. Response rate

  const respondedApplications = await Application.count({
    where: {
      userId,

      status: {
        [Op.in]: ["INTERVIEW", "OFFERED", "REJECTED"],
      },
    },
  });

  const responseRate =
    totalApplications === 0
      ? 0
      : Number(((respondedApplications / totalApplications) * 100).toFixed(2));

  // 4. Applications this month

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const applicationsThisMonth = await Application.count({
    where: {
      userId,

      appliedAt: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  // 5. Recent applications

  const recentApplications = await Application.findAll({
    where: {
      userId,
    },

    include: [
      {
        model: Company,

        attributes: ["id", "name"],
      },
    ],

    attributes: ["id", "jobTitle", "status", "appliedAt", "source"],

    order: [["appliedAt", "DESC"]],

    limit: 5,
  });

  return {
    totalApplications,

    statusCounts,

    responseRate,

    applicationsThisMonth,

    recentApplications,
  };
}

module.exports = {
  getDashboard,
};
