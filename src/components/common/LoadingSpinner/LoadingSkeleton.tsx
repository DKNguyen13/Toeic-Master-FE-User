import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaHourglassHalf } from "react-icons/fa";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 relative overflow-hidden">
      {/* Floating particles background - Blue classic */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.7, 0.3],
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main container with glassmorphism - Blue classic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50 max-w-md w-full mx-4"
      >
        {/* Enhanced Logo - Blue classic */}
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative w-28 h-28 mb-4">
            {/* Outer ring - Blue classic */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-blue-400/70 border-t-blue-600"
            />
            {/* Inner glow - Blue classic */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-xl opacity-40"
            />
            {/* Content - Blue classic */}
            <div className="absolute inset-0 rounded-full bg-white/95 shadow-xl flex flex-col items-center justify-center text-blue-600 font-bold text-lg tracking-wider border-2 border-blue-100">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaGraduationCap className="text-3xl mb-1 text-blue-600" />
              </motion.div>
              <div className="text-xs px-2 text-center leading-tight text-blue-700">
                TOEIC MASTER
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Loading Text - Blue classic */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center font-bold text-2xl tracking-wide mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FaHourglassHalf className="inline mr-2 text-blue-500" />
          </motion.span>
          Đang tải dữ liệu
        </motion.p>

        {/* Premium Animated Dots - Blue classic */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-3 mb-8"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Progress Bar - Blue classic */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: "99%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        {/* Premium Footer - Blue classic */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm font-medium italic bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent"
        >
          Hãy thư giãn trong khi chúng tôi chuẩn bị
          <motion.span animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 1.5 }}
            className="inline-block ml-2">
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSkeleton;