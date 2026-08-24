const { Application, Company, JobListing } = require("../models");
const { Op } = require("sequelize");

async function createApplication(userId, applicationData) {
  const {
    companyId,
    jobListingId,
    jobTitle,
    status,
    appliedAt,
    source,
    jobUrl,
  } = applicationData;

  // 1. Verify company belongs to current user

  const company = await Company.findOne({
    where: {
      id: companyId,
      userId,
    },
  });

  if (!company) {
    const error = new Error("Company not found or does not belong to you");

    error.statusCode = 404;
    throw error;
  }

  // 2. If a job listing is supplied,
  // verify it belongs to the user and company

  let jobListing = null;

  if (jobListingId) {
    jobListing = await JobListing.findOne({
      where: {
        id: jobListingId,
        userId,
        companyId,
      },
    });

    if (!jobListing) {
      const error = new Error(
        "Job listing not found or does not belong to this company",
      );

      error.statusCode = 404;
      throw error;
    }
  }

  // 3. Determine application title

  const finalJobTitle = jobListing?.title || jobTitle;

  if (!finalJobTitle) {
    const error = new Error("Job title is required");

    error.statusCode = 422;
    throw error;
  }

  // 4. Create application

  const application = await Application.create({
    userId,
    companyId,
    jobListingId: jobListing ? jobListing.id : null,

    jobTitle: finalJobTitle,

    status: status || "APPLIED",

    appliedAt: appliedAt || new Date(),

    source,

    jobUrl: jobUrl || jobListing?.jobUrl || null,
  });

  return application;
}

async function getApplications(userId, query) {
  const {
    search,
    status,
    companyId,
    from,
    to,
    page = 1,
    limit = 10,
    sortBy = "appliedAt",
    order = "DESC",
  } = query;

  // Pagination
  const pageNumber = Math.max(parseInt(page) || 1, 1);

  const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

  const offset = (pageNumber - 1) * limitNumber;

  // Base WHERE condition
  const where = {
    userId,
  };

  // Status filter

  if (status) {
    where.status = status;
  }

  // Company filter
  if (companyId) {
    where.companyId = companyId;
  }

  // Date filtering
// Date filtering
if (from || to) {
  const dateFilter = {};

  if (from) {
    const fromDate = new Date(
      `${from}T00:00:00`,
    );

    if (Number.isNaN(fromDate.getTime())) {
      const error = new Error(
        "Invalid from date",
      );

      error.statusCode = 422;

      throw error;
    }

    dateFilter[Op.gte] = fromDate;
  }

  if (to) {
    const toDate = new Date(
      `${to}T23:59:59`,
    );

    if (Number.isNaN(toDate.getTime())) {
      const error = new Error(
        "Invalid to date",
      );

      error.statusCode = 422;

      throw error;
    }

    dateFilter[Op.lte] = toDate;
  }

  if (from && to) {
    const fromDate = new Date(
      `${from}T00:00:00`,
    );

    const toDate = new Date(
      `${to}T23:59:59`,
    );

    if (fromDate > toDate) {
      const error = new Error(
        "From date cannot be later than to date",
      );

      error.statusCode = 422;

      throw error;
    }
  }

  where.appliedAt = dateFilter;
}
  // Search
    if (search) {
    where[Op.or] = [
      {
        jobTitle: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        "$Company.name$": {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  // Sorting

  const allowedSortFields = [
    "appliedAt",
    "createdAt",
    "updatedAt",
    "jobTitle",
    "status",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "appliedAt";

  const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";


  // Database query
  const result = await Application.findAndCountAll({
    where,

    include: [
      {
        model: Company,
        attributes: ["id", "name", "industry", "location"],
      },

      {
        model: JobListing,
        attributes: ["id", "title", "jobUrl", "location"],
      },
    ],

    order: [[safeSortBy, safeOrder]],

    limit: limitNumber,

    offset,
  });

  return {
    applications: result.rows,

    pagination: {
      totalItems: result.count,
      currentPage: pageNumber,
      itemsPerPage: limitNumber,
      totalPages: Math.ceil(result.count / limitNumber),
    },
  };
}

async function getApplicationById(userId, applicationId) {
  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },

    include: [
      {
        model: Company,
      },

      {
        model: JobListing,
      },
    ],
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  return application;
}

async function updateApplication(userId, applicationId, applicationData) {
  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  const allowedFields = ["status", "appliedAt", "source", "jobUrl"];

  const updates = {};

  for (const field of allowedFields) {
    if (applicationData[field] !== undefined) {
      updates[field] = applicationData[field];
    }
  }

  await application.update(updates);

  return application;
}

async function deleteApplication(userId, applicationId) {
  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  await application.destroy();
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
