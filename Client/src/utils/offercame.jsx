import React from 'react'
import { Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";

const OfferCame = ({ name, avatar, acceptingcall, dickliningcall }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white" >
            {/* Profile */}
            < motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center space-y-4"
            >
                <img
                    src={avatar || ""}
                    alt="Caller Avatar"
                    className="w-32 h-32 rounded-full border-2 border-green-400 shadow-lg"
                />
                <h2 className="text-2xl font-semibold">{name || 'ada'}</h2>
                <p className="text-gray-400">Incoming Video Call...</p>

                {/* Buttons */}
                < div className="flex space-x-10 mt-12" >
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={dickliningcall}
                        className="bg-red-500 hover:bg-red-600 text-white p-5 rounded-full shadow-lg"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={acceptingcall}
                        className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-lg"
                    >
                        <Phone className="w-6 h-6 rotate-90" />
                    </motion.button>
                </div >
            </motion.div>
        </div>
    );
}

export default OfferCame