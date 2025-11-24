import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, getShortUrl } from "../services/api";

export default function StatsPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const response = await api.getLink(code);
      setLink(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Link not found");
      } else {
        setError("Failed to load link stats");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Link Statistics
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Short Code
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono text-blue-600">
                {link.code}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Short URL
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-4 py-2 rounded border border-gray-300">
                {getShortUrl(link.code)}
              </code>
              <button
                onClick={() => copyToClipboard(getShortUrl(link.code))}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Target URL
            </label>
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {link.target_url}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">
                Total Clicks
              </div>
              <div className="text-3xl font-bold text-blue-600 mt-1">
                {link.total_clicks}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">Created</div>
              <div className="text-lg font-semibold text-green-600 mt-1">
                {new Date(link.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">
                Last Clicked
              </div>
              <div className="text-lg font-semibold text-purple-600 mt-1">
                {link.last_clicked
                  ? new Date(link.last_clicked).toLocaleDateString()
                  : "Never"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
