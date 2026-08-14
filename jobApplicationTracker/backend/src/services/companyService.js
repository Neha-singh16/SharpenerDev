const {Company} = require("../models");

async function createCompany(userId, companyData){
    const company = await Company.create({
        userId,
        name: companyData.name,
        website: companyData.website,
        industry: companyData.industry,
        companySize: companyData.companySize,
        location: companyData.location,
        contactName: companyData.contactName,
        contactEmail: companyData.contactEmail,
        notes: companyData.notes
    })
    return company;
}

async function getCompanies(userId){
    const companies = await Company.findAll({
        where:{
            userId,
        },

           order: [
            ["createdAt", "DESC"]
        ]
    })
    return companies;
}

async function getCompanyById(userId, companyId) {

    const company = await Company.findOne({
        where: {
            id: companyId,
            userId
        }
    });

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    return company;
}

async function updateCompany(userId, companyId, companyData) {

    const company = await Company.findOne({
        where: {
            id: companyId,
            userId
        }
    });

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = [
        "name",
        "website",
        "industry",
        "companySize",
        "location",
        "contactName",
        "contactEmail",
        "notes"
    ];

    const updates = {};

    for (const field of allowedFields) {

        if (companyData[field] !== undefined) {
            updates[field] = companyData[field];
        }

    }

    await company.update(updates);

    return company;
}

async function deleteCompany(userId, companyId) {

    const company = await Company.findOne({
        where: {
            id: companyId,
            userId
        }
    });

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    await company.destroy();
}


module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};
