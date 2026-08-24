import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateJobListing() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    companyId: "",
    title: "",
    description: "",
    location: "",
    employmentType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    jobUrl: "",
    source: "",
    status: "SAVED",
    notes: "",
  });

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      setLoadingCompanies(true);
      setError("");

      const response = await api.get("/companies");

      const data = response.data.data;

      setCompanies(
        data.companies ||
          (Array.isArray(data) ? data : [])
      );
    } catch (error) {
      console.error(error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
          "Failed to load companies"
      );
    } finally {
      setLoadingCompanies(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.companyId) {
      setError("Please select a company.");
      return;
    }

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (form.jobUrl && !form.jobUrl.startsWith("http")) {
      setError("Job URL must start with http:// or https://");
      return;
    }

    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    ) {
      setError("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/jobs", {
        companyId: Number(form.companyId),
        title: form.title.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        employmentType: form.employmentType || null,
        salaryMin: form.salaryMin
          ? Number(form.salaryMin)
          : null,
        salaryMax: form.salaryMax
          ? Number(form.salaryMax)
          : null,
        jobUrl: form.jobUrl.trim() || null,
        source: form.source.trim() || null,
        status: form.status,
        notes: form.notes.trim() || null,
      });

      alert("Job saved successfully!");

      navigate("/job-listings");
    } catch (error) {
      console.error(error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
          "Failed to save job listing"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Save Job</h1>

          <p className="page-subtitle">
            Save an interesting job opportunity for later.
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
        {/* Company */}

        <label htmlFor="companyId">
          Company
        </label>

        <select
          id="companyId"
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          required
          disabled={loadingCompanies || submitting}
        >
          <option value="">
            {loadingCompanies
              ? "Loading companies..."
              : "Select company"}
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

        {!loadingCompanies &&
          companies.length === 0 && (
            <p className="empty-state">
              No companies found. Please create a
              company first.
            </p>
          )}

        {/* Job Title */}

        <label htmlFor="title">
          Job Title
        </label>

        <input
          id="title"
          type="text"
          name="title"
          placeholder="e.g. Backend Developer"
          value={form.title}
          onChange={handleChange}
          required
          disabled={submitting}
        />

        {/* Description */}

        <label htmlFor="description">
          Job Description
        </label>

        <textarea
          id="description"
          name="description"
          placeholder="Add job description..."
          value={form.description}
          onChange={handleChange}
          rows="5"
          disabled={submitting}
        />

        {/* Location */}

        <label htmlFor="location">
          Location
        </label>

        <input
          id="location"
          type="text"
          name="location"
          placeholder="e.g. Delhi / Remote / Bengaluru"
          value={form.location}
          onChange={handleChange}
          disabled={submitting}
        />

        {/* Employment Type */}

        <label htmlFor="employmentType">
          Employment Type
        </label>

        <select
          id="employmentType"
          name="employmentType"
          value={form.employmentType}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="FULL_TIME">
            Full Time
          </option>

          <option value="PART_TIME">
            Part Time
          </option>

          <option value="CONTRACT">
            Contract
          </option>

          <option value="INTERNSHIP">
            Internship
          </option>
        </select>

        {/* Salary */}

        <label>
          Salary Range
        </label>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <input
            type="number"
            name="salaryMin"
            placeholder="Minimum salary"
            value={form.salaryMin}
            onChange={handleChange}
            min="0"
            disabled={submitting}
          />

          <input
            type="number"
            name="salaryMax"
            placeholder="Maximum salary"
            value={form.salaryMax}
            onChange={handleChange}
            min="0"
            disabled={submitting}
          />
        </div>

        {/* Job URL */}

        <label htmlFor="jobUrl">
          Job URL
        </label>

        <input
          id="jobUrl"
          type="url"
          name="jobUrl"
          placeholder="https://..."
          value={form.jobUrl}
          onChange={handleChange}
          disabled={submitting}
        />

        {/* Source */}

        <label htmlFor="source">
          Source
        </label>

        <input
          id="source"
          type="text"
          name="source"
          placeholder="LinkedIn, Naukri, Indeed, Referral..."
          value={form.source}
          onChange={handleChange}
          disabled={submitting}
        />

        {/* Status */}

        <label htmlFor="status">
          Status
        </label>

        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="SAVED">
            Saved
          </option>

          <option value="APPLIED">
            Applied
          </option>

          <option value="ARCHIVED">
            Archived
          </option>
        </select>

        {/* Notes */}

        <label htmlFor="notes">
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          placeholder="Add your notes about this job..."
          value={form.notes}
          onChange={handleChange}
          rows="4"
          disabled={submitting}
        />

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            disabled={
              submitting ||
              loadingCompanies ||
              companies.length === 0
            }
          >
            {submitting
              ? "Saving..."
              : "Save Job"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/job-listings")
            }
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJobListing;