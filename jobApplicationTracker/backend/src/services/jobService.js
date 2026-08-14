const { JobListing, Company } = require("../models");


async function createJob(userId, jobData) {

    const company = await Company.findOne({
        where: {
            id: jobData.companyId,
            userId
        }
    });

    if (!company) {
        const error = new Error(
            "Company not found or does not belong to you"
        );

        error.statusCode = 404;

        throw error;
    }

    const job = await JobListing.create({
        userId,
        companyId: jobData.companyId,
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        employmentType: jobData.employmentType,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        jobUrl: jobData.jobUrl,
        source: jobData.source,
        status: jobData.status || "SAVED",
        notes: jobData.notes
    });

    return job;
}


async function getJobs(userId) {

    return await JobListing.findAll({
        where: {
            userId
        },
        include: [
            {
                model: Company,
                attributes: [
                    "id",
                    "name",
                    "website",
                    "industry"
                ]
            }
        ],
        order: [
            ["createdAt", "DESC"]
        ]
    });
}


async function getJobById(userId, jobId) {

    const job = await JobListing.findOne({
        where: {
            id: jobId,
            userId
        },
        include: [
            {
                model: Company,
                attributes: [
                    "id",
                    "name",
                    "website",
                    "industry"
                ]
            }
        ]
    });

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    return job;
}


async function updateJob(userId, jobId, jobData) {

    const job = await JobListing.findOne({
        where: {
            id: jobId,
            userId
        }
    });

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    if (jobData.companyId !== undefined) {

        const company = await Company.findOne({
            where: {
                id: jobData.companyId,
                userId
            }
        });

        if (!company) {
            const error = new Error(
                "Company not found or does not belong to you"
            );

            error.statusCode = 404;

            throw error;
        }
    }

    const allowedFields = [
        "companyId",
        "title",
        "description",
        "location",
        "employmentType",
        "salaryMin",
        "salaryMax",
        "jobUrl",
        "source",
        "status",
        "notes"
    ];

    const updates = {};

    for (const field of allowedFields) {

        if (jobData[field] !== undefined) {
            updates[field] = jobData[field];
        }

    }

    await job.update(updates);

    return job;
}


async function deleteJob(userId, jobId) {

    const job = await JobListing.findOne({
        where: {
            id: jobId,
            userId
        }
    });

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    await job.destroy();
}


module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};