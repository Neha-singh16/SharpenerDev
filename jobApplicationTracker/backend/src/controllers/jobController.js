const jobService = require("../services/jobService");


async function createJob(req, res, next) {

    try {

        const job = await jobService.createJob(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Job listing saved successfully",
            data: job
        });

    } catch (error) {
        next(error);
    }
}


async function getJobs(req, res, next) {

    try {

        const jobs = await jobService.getJobs(
            req.user.id,
              req.query
        );

        res.status(200).json({
            success: true,
            data: jobs
        });

    } catch (error) {
        next(error);
    }
}


async function getJobById(req, res, next) {

    try {

        const job = await jobService.getJobById(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: job
        });

    } catch (error) {
        next(error);
    }
}


async function updateJob(req, res, next) {

    try {

        const job = await jobService.updateJob(
            req.user.id,
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Job listing updated successfully",
            data: job
        });

    } catch (error) {
        next(error);
    }
}


async function deleteJob(req, res, next) {

    try {

        await jobService.deleteJob(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Job listing deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};