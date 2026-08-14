import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateApplication() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [form, setForm] = useState({
        companyId: "",
        jobTitle: "",
        status: "APPLIED",
        appliedAt: "",
        source: "",
        jobUrl: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        loadCompanies();
    }, []);


    async function loadCompanies() {

        try {

            const response =
                await api.get("/companies");

            setCompanies(
                response.data.data.companies ||
                response.data.data ||
                []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load companies"
            );
        }
    }


    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            await api.post(
                "/applications",
                {
                    ...form,
                    companyId: Number(form.companyId)
                }
            );

            navigate("/applications");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create application"
            );

        } finally {

            setLoading(false);
        }
    }


    return (
        <div className="dashboard">

            <h1>Add Job Application</h1>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <form
                className="application-form"
                onSubmit={handleSubmit}
            >

                <label>
                    Company
                </label>

                <select
                    name="companyId"
                    value={form.companyId}
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select company
                    </option>

                    {companies.map((company) => (

                        <option
                            key={company.id}
                            value={company.id}
                        >
                            {company.name}
                        </option>

                    ))}

                </select>


                <label>
                    Job Title
                </label>

                <input
                    type="text"
                    name="jobTitle"
                    placeholder="e.g. Backend Developer"
                    value={form.jobTitle}
                    onChange={handleChange}
                    required
                />


                <label>
                    Status
                </label>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >

                    <option value="APPLIED">
                        Applied
                    </option>

                    <option value="INTERVIEW">
                        Interview
                    </option>

                    <option value="OFFERED">
                        Offered
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>

                </select>


                <label>
                    Application Date
                </label>

                <input
                    type="date"
                    name="appliedAt"
                    value={form.appliedAt}
                    onChange={handleChange}
                />


                <label>
                    Source
                </label>

                <input
                    type="text"
                    name="source"
                    placeholder="LinkedIn, Naukri, Referral..."
                    value={form.source}
                    onChange={handleChange}
                />


                <label>
                    Job URL
                </label>

                <input
                    type="url"
                    name="jobUrl"
                    placeholder="https://..."
                    value={form.jobUrl}
                    onChange={handleChange}
                />


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Application"}
                </button>

            </form>

        </div>
    );
}

export default CreateApplication;