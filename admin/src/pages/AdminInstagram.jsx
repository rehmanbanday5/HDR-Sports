import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

const emptyForm = {
  link: "",
};

const AdminInstagram = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    try {
      const { data } = await api.get("/instagram");
      setPosts(data.posts || []);
    } catch {
      toast.error("Failed to load Instagram posts");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Select an image");
      return;
    }

    const body = new FormData();
    body.append("image", image);
body.append("instagramUrl", form.link);


    try {
      setLoading(true);

      await api.post("/instagram", body);

      toast.success("Instagram Post Added");

      setForm(emptyForm);
      setImage(null);

      loadPosts();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this Instagram post?")) return;

    try {
      await api.delete(`/instagram/${id}`);

      toast.success("Deleted");

      loadPosts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Instagram Posts</h1>
        <p className="text-gray-500 mt-2">Manage homepage Instagram gallery.</p>
      </div>

      <form
        onSubmit={submitHandler}
        className="bg-white rounded-xl shadow p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold mb-2">
            Instagram Link
          </label>

          <input
            type="text"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="https://instagram.com/..."
          />
        </div>

        <div></div>

        <div>
          <label className="block text-sm font-semibold mb-2">Image</label>

          <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#C9A227] hover:bg-[#faf7ee] transition">
            <div className="text-center">
              <p className="font-semibold text-gray-700">
                Click To Upload Instagram Image
              </p>

              <p className="text-sm text-gray-400 mt-2">JPG, PNG or WEBP</p>

              {image && (
                <p className="mt-3 text-[#C9A227] font-semibold">
                  ✓ {image.name}
                </p>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        <button
          disabled={loading}
          className="bg-[#C9A227] px-7 py-3 rounded-lg font-semibold"
        >
          {loading ? "Uploading..." : "Add Instagram Post"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
        <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-b">
                <td className="p-4">
                  <img
                    src={post.image.url}
                    className="w-20 h-20 object-cover rounded"
                    alt=""
                  />
                </td>

                <td className="max-w-sm truncate">{post.instagramUrl}</td>

                <td className="text-center">
                  <button
                    onClick={() => deleteHandler(post._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!posts.length && (
              <tr>
                <td colSpan="3" className="text-center p-10 text-gray-500">
                  No Instagram posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInstagram;
