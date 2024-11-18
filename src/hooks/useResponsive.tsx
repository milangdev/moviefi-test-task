import { useState, useEffect } from "react";

/**
 * useResponsive hook
 *
 * This hook uses the window.matchMedia API to detect if the app is running on a small, medium or large device.
 * It returns an object with 3 properties: isSmallDevice, isMediumDevice and isLargeDevice.
 *
 * isSmallDevice: true if the app is running on a device with a width equal to or less than 768px.
 * isMediumDevice: true if the app is running on a device with a width greater than 768px and less than or equal to 1024px.
 * isLargeDevice: true if the app is running on a device with a width greater than 1024px.
 *
 * The hook will update the state whenever the window is resized.
 **/
export const useResponsive = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isMediumDevice, setIsMediumDevice] = useState(false);
  const [isLargeDevice, setIsLargeDevice] = useState(false);

  useEffect(() => {
    const checkMediaQueries = () => {
      setIsSmallDevice(window.matchMedia("(max-width: 768px)").matches);
      setIsMediumDevice(
        window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches
      );
      setIsLargeDevice(window.matchMedia("(min-width: 1025px)").matches);
    };

    // Initial check
    checkMediaQueries();

    // Update on resize
    const handleResize = () => checkMediaQueries();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
  };
};
