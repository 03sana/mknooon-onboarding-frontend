import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Brand {
  id: number;
  name: string;
  slug: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Brand>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/brands`);
      if (!response.ok) throw new Error("Failed to fetch brands");
      const data = await response.json();
      setBrands(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setEditData({ ...brand });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(`${API_URL}/admin/brands/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error("Failed to update brand");

      setSuccess("Brand updated successfully!");
      setEditingId(null);
      fetchBrands();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update brand");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Brands</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="p-6">
            {editingId === brand.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Brand Name
                  </label>
                  <Input
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <Input
                    value={editData.slug || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, slug: e.target.value })
                    }
                    placeholder="Brand slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Video URL
                  </label>
                  <Input
                    value={editData.video_url || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, video_url: e.target.value })
                    }
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the full YouTube embed URL
                  </p>
                </div>

                {editData.video_url && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preview
                    </label>
                    <iframe
                      width="100%"
                      height="250"
                      src={editData.video_url}
                      title="Video Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-700"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{brand.name}</h2>
                  <p className="text-gray-600 mb-2">Slug: {brand.slug}</p>
                  <a
                    href={brand.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Video
                  </a>
                </div>
                <Button
                  onClick={() => handleEdit(brand)}
                  className="bg-yellow-500 hover:bg-yellow-700"
                >
                  Edit
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
