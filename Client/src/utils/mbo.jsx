import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Hamburger & cross icons

export default function MobileUserBar({ otheruser }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Hamburger button */}
            <div className="fixed bottom-2 right-2 z-50 md:hidden">
                <button
                    onClick={() => setOpen(true)}
                    className="btn btn-circle btn-sm bg-indigo-500 text-white shadow-lg"
                >
                    <FaBars />
                </button>
            </div>

            {/* Overlay & user list */}
            {open && (
                <div className="fixed inset-0 bg-black/40 z-40 flex justify-end md:hidden">
                    {/* Sidebar container */}
                    <div className="flex flex-col bg-base-100 w-60 h-full p-4 shadow-xl relative">
                        {/* Close button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 btn btn-circle btn-sm bg-red-500 text-white"
                        >
                            <FaTimes />
                        </button>

                        {/* Users */}
                        <h2 className="text-lg font-bold mb-3">Chats</h2>
                        <div className="flex flex-col gap-4 overflow-y-auto h-full">
                            {otheruser?.map((e) => (
                                <div key={e._id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md">
                                    <div className="avatar w-12">
                                        <div className="w-full rounded-full ring-2">
                                            <img
                                                src={e.avatar || "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"}
                                            />
                                        </div>
                                    </div>
                                    <span className="line-clamp-1">{e.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
