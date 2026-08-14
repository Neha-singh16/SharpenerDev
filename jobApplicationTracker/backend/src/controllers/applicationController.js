const applicationService = require("../services/applicationService");


async function createApplication(req, res, next) {

    try {

        const application =
            await applicationService.createApplication(
                req.user.id,
                req.body
            );


        res.status(201).json({
            success: true,
            message: "Job application created successfully",
            data: application
        });

    } catch (error) {
        next(error);
    }
}


async function getApplications(req, res, next) {

    try {

        const applications =
            await applicationService.getApplications(
                req.user.id,
                req.query
            );


        res.status(200).json({
            success: true,
            data: applications
        });

    } catch (error) {
        next(error);
    }
}


async function getApplicationById(req, res, next) {

    try {

        const application =
            await applicationService.getApplicationById(
                req.user.id,
                req.params.id
            );


        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {
        next(error);
    }
}


async function updateApplication(req, res, next) {

    try {

        const application =
            await applicationService.updateApplication(
                req.user.id,
                req.params.id,
                req.body
            );


        res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: application
        });

    } catch (error) {
        next(error);
    }
}


async function deleteApplication(req, res, next) {

    try {

        await applicationService.deleteApplication(
            req.user.id,
            req.params.id
        );


        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
};