import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditCompany() {

    const { id } = useParams();

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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // Load existing company
    useEffect(() => {
        loadCompany();
    }, [id]);


    async function loadCompany() {

        try {

            setLoading(true);

            const response =
                await api.get(`/companies/${id}`);

            const company = response.data.data;

            setForm({
                name: company.name || "",
                industry: company.industry || "",
                location: company.location || "",
                website: company.website || "",
                contactEmail: company.contactEmail || "",
                companySize: company.companySize || "",
                notes: company.notes || ""
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load company"
            );

        } finally {

            setLoading(false);
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

            setSaving(true);
            setError("");

            await api.put(
                `/companies/${id}`,
                form
            );

            navigate("/companies");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update company"
            );

        } finally {

            setSaving(false);
        }
    }


    if (loading) {

        return (
            <div className="dashboard">
                <p>Loading company...</p>
            </div>
        );
    }


    return (

        <div className="dashboard">

            <div className="page-header">

                <div>

                    <h1>
                        Edit Company
                    </h1>

                    <p className="page-subtitle">
                        Update company information.
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
                    value={form.industry}
                    onChange={handleChange}
                />


                <label>
                    Location
                </label>

                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                />


                <label>
                    Website
                </label>

                <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                />


                <label>
                    Contact Email
                </label>

                <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                />


                <label>
                    Company Size
                </label>

                <input
                    type="text"
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                />


                <label>
                    Notes
                </label>

                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                />


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>

            </form>

        </div>
    );
}

export default EditCompany;