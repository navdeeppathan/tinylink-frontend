import React, { useState, useEffect } from "react";
import { api, getShortUrl } from "../services/api";
import { RotatingLines, ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import StatsModal from "./StatsPage";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await api.getLinks();
      setLinks(response.data);
      setError("");
    } catch (err) {
      setError(err.response.data.error || "Failed to load links");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.createLink({
        target_url: targetUrl,
        custom_code: customCode || undefined,
      });

      setSuccess("Link created successfully!");
      setTargetUrl("");
      setCustomCode("");
      fetchLinks();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Code already exists. Please try another.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Invalid input");
      } else {
        setError("Failed to create link");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Delete link ${code}?`)) return;

    try {
      await api.deleteLink(code);
      fetchLinks();
      toast.success("Link deleted successfully!");
    } catch (err) {
      toast.error(err.response.data.error || "Failed to delete link");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-4xl font-medium text-gray-900 mb-2">TinyLink</h1>
        <p className="text-gray-600 text-sm font-normal">
          Shorten your URLs and track clicks
        </p>
      </header>

      {/* Add Link Form */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Create Short Link</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target URL *
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              required
              className="w-full px-4 py-2 border text-sm font-normal bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Code (optional)
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="mycode (6-8 alphanumeric characters)"
              pattern="[A-Za-z0-9]{6,8}"
              className="w-full md:w-1/2 px-4 py-2 bg-white border text-sm font-normal border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs font-normal text-gray-500 mt-1">
              Leave empty to generate automatically
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border text-sm font-normal border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border text-sm font-normal border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="flex items-center justify-end mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-1/3 bg-blue-600 cursor-pointer text-sm text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-normal flex items-center justify-center gap-2 transition"
            >
              {submitting ? (
                <ThreeDots
                  height="18"
                  width="18"
                  color="#ffffff"
                  visible={true}
                />
              ) : (
                "Create Short Link"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">All Links</h2>
          <input
            type="text"
            placeholder="Search by code or target URL"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm font-normal border border-gray-300 rounded-lg w-64"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <RotatingLines
              strokeColor="gray"
              strokeWidth="5"
              animationDuration="0.75"
              width="60"
              visible={true}
            />
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No links found. Create your first link above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm border-gray-200">
                  <th className="text-left py-3 px-4  font-medium text-gray-700">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Target URL
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Clicks
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Last Clicked
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => (
                  <tr
                    key={link.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <span className=" text-xs font-normal text-blue-600">
                        {link.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className="max-w-md text-xs font-normal truncate"
                        title={link.target_url}
                      >
                        {link.target_url}
                      </div>
                    </td>
                    <td className="py-3 text-xs font-normal px-4">
                      {link.total_clicks}
                    </td>
                    <td className="py-3 px-4 text-xs font-normal text-gray-600">
                      {link.last_clicked
                        ? new Date(link.last_clicked).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            copyToClipboard(getShortUrl(link.code))
                          }
                          className="text-white cursor-pointer flex items-center justify-center bg-blue-400 px-2 py-1 rounded hover:bg-blue-800 text-sm font-normal"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCode(link.code);
                            setModalOpen(true);
                          }}
                          className="text-white  flex cursor-pointer items-center justify-center hover:text-green-800  bg-green-400 px-2 py-1 rounded text-sm font-normal"
                        >
                          Stats
                        </button>
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="text-white flex cursor-pointer items-center justify-center hover:text-red-800 bg-red-400 px-2 py-1 rounded  text-sm font-normal"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <StatsModal
        code={selectedCode}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
