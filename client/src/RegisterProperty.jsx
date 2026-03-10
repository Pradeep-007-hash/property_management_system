import { useState, useContext } from "react";
import Header from "./Header";
import { ThemeContext } from "./ThemeContext";
import { WalletContext } from "./WalletContext";
import { ethers } from 'ethers';
import { getPropertyContract } from './contract';
import { pinJSON, pinFile } from './ipfs';

export default function RegisterProperty() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    confirm: false,
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!formData.confirm) {
      alert("Please confirm ownership before registering.");
      return;
    }

    if (!signer) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      // upload any selected files to Pinata first
      const fileHashes = [];
      for (const f of files) {
        const res = await pinFile(f);
        fileHashes.push(res.IpfsHash);
      }

      // create metadata object and pin to IPFS
      const metadata = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        files: fileHashes,
      };
      const metaRes = await pinJSON(metadata);
      const ipfsHash = metaRes.IpfsHash;

      const contract = getPropertyContract(signer);
      const priceWei = ethers.parseEther(formData.price || "0");
      const tx = await contract.registerProperty(
        formData.name,
        formData.location,
        ipfsHash,
        priceWei,
      );
      await tx.wait();
      alert(`Property registered (tx: ${tx.hash})`);
      setFormData({ name: '', price: '', location: '', description: '', confirm: false });
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useContext(ThemeContext);
  const { signer } = useContext(WalletContext);

  return (
    <>
      <Header />

      {/* include theme variable so component re-renders when it changes */}
      <main className={`min-h-screen w-full transition-colors duration-300 ${
          theme === 'dark'
            ? 'dark bg-slate-950 text-white'
            : 'bg-white text-slate-900'
        }`}>
        <div className="max-w-7xl mx-auto px-4 py-16 pt-24">

          {/* Page Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Register Your Property on Blockchain
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Securely record property details using Ethereum smart contracts and IPFS.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form Section */}
            <div className={`lg:col-span-2 rounded-3xl p-8 shadow-xl transition-colors duration-300 ${
              theme === 'dark' ? 'bg-slate-900' : 'bg-white'
            }`}>

              <div className="space-y-6">

                {/* Property Name */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Sapphire Heights Villa"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Property Price (ETH)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Property Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Full address or GPS coordinates"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Property Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the property..."
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Property Documents
                  </label>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className={`w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100 transition ${
                      theme === 'dark'
                        ? 'text-slate-400 file:bg-slate-800'
                        : 'text-slate-500 file:bg-indigo-50'
                    }`}
                  />

                  {files.length > 0 && (
                    <p className="mt-2 text-xs text-green-500">
                      {files.length} file(s) selected
                    </p>
                  )}
                </div>

                {/* Confirm Checkbox */}
                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800'
                    : 'bg-slate-100'
                }`}>
                  <input
                    type="checkbox"
                    name="confirm"
                    checked={formData.confirm}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    I confirm that I am the legal owner and understand that blockchain registration is permanent.
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Register on Blockchain"}
                  </button>

                  <button
                    type="button"
                    className={`px-6 py-3 rounded-xl transition ${
                      theme === 'dark'
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Steps */}
              <div className={`rounded-3xl p-6 shadow-xl transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-white'
              }`}>
                <h3 className="text-lg font-bold mb-4">
                  Registration Steps
                </h3>

                <ol className={`space-y-3 text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <li>1️⃣ Upload documents to IPFS</li>
                  <li>2️⃣ Confirm transaction in wallet</li>
                  <li>3️⃣ Property minted as NFT</li>
                </ol>
              </div>

              {/* Gas Fee Card */}
              <div className={`rounded-3xl p-6 shadow-xl transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-white'
              }`}>
                <p className={`text-xs uppercase ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Estimated Gas Fee
                </p>
                <p className="text-lg font-mono font-bold text-indigo-600">
                  0.0042 ETH
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}