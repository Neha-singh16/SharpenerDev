import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        careerGoal: "",
        experienceLevel: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        loadProfile();
    }, []);


    async function loadProfile() {

        try {

            const response =
                await api.get("/profile/me");

            const user =
                response.data.data;

            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                location: user.location || "",
                careerGoal: user.careerGoal || "",
                experienceLevel:
                    user.experienceLevel || ""
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load profile"
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
            setMessage("");
            setError("");


            const response =
                await api.put(
                    "/profile/me",
                    {
                        phone: form.phone,
                        location: form.location,
                        careerGoal: form.careerGoal,
                        experienceLevel:
                            form.experienceLevel
                    }
                );


            setForm((previous) => ({
                ...previous,
                ...response.data.data
            }));


            setMessage(
                "Profile updated successfully"
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);
        }
    }


    if (loading) {

        return (
            <div className="dashboard">
                <p>Loading profile...</p>
            </div>
        );
    }


    return (

        <div className="dashboard">

            <div className="page-header">

                <div>
                    <h1>My Profile</h1>

                    <p className="page-subtitle">
                        Manage your personal information
                        and career goals.
                    </p>
                </div>

            </div>


            {message && (
                <p className="success">
                    {message}
                </p>
            )}


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
                    Name
                </label>

                <input
                    type="text"
                    value={form.name}
                    disabled
                />


                <label>
                    Email
                </label>

                <input
                    type="email"
                    value={form.email}
                    disabled
                />


                <label>
                    Phone
                </label>

                <input
                    type="text"
                    name="phone"
                    value={form.phone}
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
                    Career Goal
                </label>

                <input
                    type="text"
                    name="careerGoal"
                    placeholder="e.g. Backend Developer"
                    value={form.careerGoal}
                    onChange={handleChange}
                />


                <label>
                    Experience Level
                </label>

                <select
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                >

                    <option value="">
                        Select level
                    </option>

                    <option value="Fresher">
                        Fresher
                    </option>

                    <option value="Junior">
                        Junior
                    </option>

                    <option value="Mid-Level">
                        Mid-Level
                    </option>

                    <option value="Senior">
                        Senior
                    </option>

                </select>


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Profile"}
                </button>

            </form>

        </div>
    );
}

export default Profile;