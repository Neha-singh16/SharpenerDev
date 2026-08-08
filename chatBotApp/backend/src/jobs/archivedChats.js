const { CronJob } = require("cron");

const archivedChatService = require("../services/archivedChatService");

const archiveJob = new CronJob(
    "0 0 2 * * *",

    async function () {

        console.log(
            "Starting daily chat archival..."
        );

        try {

            const result =
                await archivedChatService.archiveChats();

            console.log(
                "Daily archival completed:",
                result
            );

        } catch (err) {

            console.error(
                "Daily archival failed:",
                err
            );
        }
    },

    null,

    true,

    "Asia/Kolkata"
);

module.exports = archiveJob;