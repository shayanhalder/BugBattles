import React, { useEffect, useState } from 'react';
import { Alert, AlertContent, AlertIndicator, AlertTitle, Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerAlertProps {
  isVisible: boolean;
  isCorrect: boolean;
  onClose: () => void;
}

const AnswerAlert: React.FC<AnswerAlertProps> = ({ isVisible, isCorrect, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <Box
          position="fixed"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={9999}
          width="auto"
          minWidth="300px"
          maxWidth="90vw"
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Alert.Root
              status={isCorrect ? "success" : "error"}
              variant="solid"
              borderRadius="md"
              boxShadow="lg"
            >
              <AlertIndicator />
              <AlertContent>
                <AlertTitle>
                  {isCorrect ? "Correct!" : "Incorrect!"}
                </AlertTitle>
              </AlertContent>
            </Alert.Root>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default AnswerAlert;
