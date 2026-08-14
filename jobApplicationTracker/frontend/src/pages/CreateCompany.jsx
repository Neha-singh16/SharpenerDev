import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateCompany() {

    const navigate = useNavigate();


    const [form, setForm] = useState({
        name: "",
        industry: "",
        location: "",
        website: "",
        contactEmail: "",
        companySize: "",
        notes: ""
    });


    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


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
                "/companies",
                form
            );


            navigate("/companies");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create company"
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="dashboard">

            <div className="page-header">

                <div>

                    <h1>
                        Add Company
                    </h1>

                    <p className="page-subtitle">
                        Save company information for
                        your job search.
                    </p>

                </div>

            </div>


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
                    Company Name *
                </label>

                <input
                    type="text"
                    name="name"
                    placeholder="e.g. Google"
                    value={form.name}
                    onChange={handleChange}
                    required
                />


                <label>
                    Industry
                </label>

                <input
                    type="text"
                    name="industry"
                    placeholder="e.g. Technology"
                    value={form.industry}
                    onChange={handleChange}
                />


                <label>
                    Location
                </label>

                <input
                    type="text"
                    name="location"
                    placeholder="e.g. Bangalore"
                    value={form.location}
                    onChange={handleChange}
                />


                <label>
                    Website
                </label>

                <input
                    type="url"
                    name="website"
                    placeholder="https://company.com"
                    value={form.website}
                    onChange={handleChange}
                />


                <label>
                    Contact Email
                </label>

                <input
                    type="email"
                    name="contactEmail"
                    placeholder="recruiter@company.com"
                    value={form.contactEmail}
                    onChange={handleChange}
                />


                <label>
                    Company Size
                </label>

                <input
                    type="text"
                    name="companySize"
                    placeholder="e.g. 1000-5000"
                    value={form.companySize}
                    onChange={handleChange}
                />


                <label>
                    Notes
                </label>

                <textarea
                    name="notes"
                    placeholder="Add information about this company..."
                    value={form.notes}
                    onChange={handleChange}
                />


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Company"}
                </button>

            </form>

        </div>
    );
}

export default CreateCompany;