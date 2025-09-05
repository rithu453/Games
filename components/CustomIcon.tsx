import { motion } from 'framer-motion';

interface CustomIconProps {
  type: string;
  className?: string;
}

export function CustomIcon({ type, className = "w-8 h-8" }: CustomIconProps) {
  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 }
  };

  switch (type) {
    case 'breath':
      return (
        <motion.svg
          className={className}
          viewBox="0 0 64 64"
          fill="none"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.circle
            cx="32"
            cy="32"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.circle
            cx="32"
            cy="32"
            r="12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
          <motion.circle
            cx="32"
            cy="32"
            r="6"
            fill="currentColor"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.svg>
      );

    case 'timer':
      return (
        <motion.svg
          className={className}
          viewBox="0 0 64 64"
          fill="none"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.circle
            cx="32"
            cy="32"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <motion.path
            d="M32 8 L32 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M32 32 L44 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "32px 32px" }}
          />
        </motion.svg>
      );

    case 'oracle':
      return (
        <motion.svg
          className={className}
          viewBox="0 0 64 64"
          fill="none"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.rect
            x="12"
            y="16"
            width="40"
            height="32"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ y: 20, opacity: 0.5 }}
            animate={{ y: 16, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M20 28 L44 28 M20 36 L36 36"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.circle
            cx="40"
            cy="36"
            r="2"
            fill="currentColor"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'meditation':
      return (
        <motion.svg
          className={className}
          viewBox="0 0 64 64"
          fill="none"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.path
            d="M32 16 C40 16 46 22 46 30 C46 38 40 44 32 44 C24 44 18 38 18 30 C18 22 24 16 32 16 Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <motion.path
            d="M24 30 Q32 24 40 30"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.circle
            cx="28"
            cy="26"
            r="1.5"
            fill="currentColor"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="36"
            cy="26"
            r="1.5"
            fill="currentColor"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </motion.svg>
      );

    case 'maze':
      return (
        <motion.svg
          className={className}
          viewBox="0 0 64 64"
          fill="none"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.rect
            x="8"
            y="8"
            width="48"
            height="48"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <motion.path
            d="M16 8 L16 24 M24 16 L40 16 M32 24 L32 40 M40 32 L56 32 M24 40 L24 56 M40 48 L56 48"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="2"
            fill="currentColor"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="52"
            cy="52"
            r="2"
            fill="currentColor"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </motion.svg>
      );

    case 'canvas':
      return (
        <motion.svg
          className={className}
          viewBox="0 0 64 64"
          fill="none"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.rect
            x="12"
            y="12"
            width="40"
            height="32"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <motion.path
            d="M16 24 Q24 20 32 28 Q40 36 48 32"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="20"
            cy="20"
            r="2"
            fill="currentColor"
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle
            cx="44"
            cy="36"
            r="2"
            fill="currentColor"
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          />
          <motion.path
            d="M20 48 L24 52 L20 56 L16 52 Z"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
        </motion.svg>
      );

    default:
      return (
        <div className={`${className} bg-current rounded-full opacity-50`} />
      );
  }
}
