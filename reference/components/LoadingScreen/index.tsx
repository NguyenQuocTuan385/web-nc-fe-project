import clsx from 'clsx';
import { memo } from 'react';
import { motion } from 'framer-motion';
import classes from './styles.module.scss'
import logo from 'assets/img/logo-50x50.png'; 

interface LoadingScreenProps {
  className?: string
}

const LoadingScreen = memo(({ className, ...other }: LoadingScreenProps) => {

  return (
    <div className={clsx(classes.root, className)} {...other}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          repeatDelay: 1
        }}
      >
        <div className={classes.boxLogo}>
          <img alt='logo' src={logo} />
        </div>
      </motion.div>

      <motion.div
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{
          ease: 'linear',
          duration: 2.2,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        className={clsx(classes.box, classes.inner)}
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{
          ease: 'linear',
          duration: 2.2,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
        className={clsx(classes.box, classes.outside)}
      />
    </div>
  );
})

export default LoadingScreen;
