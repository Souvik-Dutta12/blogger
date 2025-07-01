import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';


const Profile = () => {

    const { axios, navigate, setUser } = useAppContext();

    const user = JSON.parse(localStorage.getItem("user"));

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');


    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [profileImageFile, setProfileImageFile] = useState(null); // to upload


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file); // for uploading
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // for previewing
            };
            reader.readAsDataURL(file);
        }
    };



    const handleUpdate = async () => {
        if (!username && !email && !profileImageFile) {
            return toast.error("No changes to update.");
        }

        if (!password) {
            return toast.error("Password is required to update profile.");
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("password", password);
            if (username) formData.append("username", username);
            if (email) formData.append("email", email);

            // ✅ Only upload the actual file
            if (profileImageFile) {
                formData.append("profileImage", profileImageFile);
            }

            const response = await axios.patch("/users/user/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const updatedUser = response.data?.data;

            if (!updatedUser || !updatedUser._id) {
                toast.error("Update failed: user data not returned");
                return;
            }


            toast.success("Profile updated successfully!");
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setProfileImage(updatedUser.profileImage); // preview new image
            setProfileImageFile(null); // reset file
            setUser(updatedUser)

            setShowModal(false);
            navigate(`/users/user/${updatedUser._id}`);

        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Unknown error";

            toast.error("Update failed: " + message);
        } finally {
            setLoading(false);
        }
    };



    return (


        user && (
            <>
                <div className="md:min-h-screen z-20 md:w-screen sm:w-[85vw] flex items-center justify-center px-4">
                    <div className="w-full z-40 max-w-md bg-transparent rounded-xl shadow-md md:p-10 sm:p-5 md:mt-29 space-y-5 flex flex-col items-center justify-center">
                        <h2 className=" font-bold  text-center relative z-10 text-2xl sm:text-5xl md:text-6xl lg:text-4xl  bg-clip-text  text-transparent bg-gradient-to-b from-white to-neutral-500 font-sans leading-tight ">Your Profile</h2>

                        <div className="w-40 h-40 relative rounded-full  border-2 border-zinc-600 ">
                            <img
                                src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=3f3f46&fontWeight=600`}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                            <label className="w-auto absolute bottom-0 z-20 right-0  text-md font-normal px-4 py-2 border rounded-full bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 cursor-pointer  text-cyan-400 hover:text-cyan-300">
                                <i className="ri-upload-fill text-xl"></i>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className=" hidden"
                                />
                            </label>
                        </div>



                        <div className="w-full max-w-sm space-y-4">
                            <div className='flex flex-col gap-1'>
                                <label className="block text-md font-bold text-white">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                                />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className="block text-md font-bold text-white">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                                />
                            </div>

                            <HoverBorderGradient
                                containerClassName="rounded-full w-1/2 mt-3"
                                as="button"
                                className=" dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
                                onClick={() => setShowModal(true)}
                            >

                                <span className='hover:text-[#7fcfec] duration-300 flex items-center justify-center gap-1'>{loading ? 'Saving...' : 'Save Changes'}</span>
                            </HoverBorderGradient>

                        </div>
                    </div>
                </div>



                {/* Modal for Password */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-100">
                        <div className="bg-zinc-950 border border-zinc-700 p-6 rounded-xl space-y-4 w-[90%] sm:w-[400px]">
                            <h3 className="text-white text-xl font-bold">Confirm Your Password</h3>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 cursor-pointer duration-300 text-white"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 cursor-pointer duration-300 text-white"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </>
        )



    );
};

export default Profile;
