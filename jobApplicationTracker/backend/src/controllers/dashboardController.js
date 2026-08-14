const dashboardService =
    require("../services/dashboardService");


async function getDashboard(req, res, next) {

    try {

        const dashboard =
            await dashboardService.getDashboard(
                req.user.id
            );


        res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (error) {

        next(error);
    }
}


module.exports = {
    getDashboard
};