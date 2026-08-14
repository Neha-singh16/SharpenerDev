const noteService =
    require("../services/noteService");


async function createNote(req, res, next) {

    try {

        const note =
            await noteService.createNote(
                req.user.id,
                req.params.applicationId,
                req.body.content
            );


        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });

    } catch (error) {
        next(error);
    }
}


async function getNotes(req, res, next) {

    try {

        const notes =
            await noteService.getNotes(
                req.user.id,
                req.params.applicationId
            );


        res.status(200).json({
            success: true,
            data: notes
        });

    } catch (error) {
        next(error);
    }
}


async function updateNote(req, res, next) {

    try {

        const note =
            await noteService.updateNote(
                req.user.id,
                req.params.id,
                req.body.content
            );


        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });

    } catch (error) {
        next(error);
    }
}


async function deleteNote(req, res, next) {

    try {

        await noteService.deleteNote(
            req.user.id,
            req.params.id
        );


        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createNote,
    getNotes,
    updateNote,
    deleteNote
};