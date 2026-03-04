import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddProduct = () => {
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const brandRef = useRef(null);
  const ratingRef = useRef(null);
  const numReviewsRef = useRef(null);
  const stockRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("price", priceRef.current.value);
    formData.append("category", categoryRef.current.value);
    formData.append("brand", brandRef.current.value);
    formData.append("rating", ratingRef.current.value);
    formData.append("numReviews", numReviewsRef.current.value);
    formData.append("stock", stockRef.current.value);
    formData.append("image", imageRef.current.files[0]);

    const response = await fetch("http://localhost:3001/api/seller/products", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (response.status === 201) {
      navigate("/");
    } else {
      const data = await response.json();
      console.log(data);
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";

  const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-slate-400 mt-2">
            Fill in the details below to list a new product
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 space-y-6"
          encType="multipart/form-data"
        >
          {/* Row 1: Name & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Wireless Headphones"
                ref={nameRef}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Brand</label>
              <input
                type="text"
                placeholder="e.g. Sony"
                ref={brandRef}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              placeholder="Describe your product..."
              ref={descriptionRef}
              rows={3}
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Row 2: Price, Category, Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClasses}>Price (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                ref={priceRef}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Category</label>
              <select ref={categoryRef} className={inputClasses}>
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Stock</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                ref={stockRef}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Row 3: Rating & Num Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Rating</label>
              <input
                type="number"
                placeholder="0 - 5"
                min="0"
                max="5"
                step="0.1"
                ref={ratingRef}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Number of Reviews</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                ref={numReviewsRef}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClasses}>Product Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-slate-700/30 transition-all duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-slate-400">
                  Click to upload or drag and drop
                </p>
              </div>
              <input type="file" ref={imageRef} className="hidden" accept="image/*" />
            </label>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;