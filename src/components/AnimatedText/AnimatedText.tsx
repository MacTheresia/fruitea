import React, { useState, useEffect } from "react";
import { Text } from "react-native";

import stylesObj from '../../styles'


type AnimatedTextProps = {
  text: string;
  speed?: number;
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (currentIndex < text.length) {
          const next = prev + text[currentIndex];
          currentIndex++;
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <Text style={stylesObj.TextStyles.titre}>{displayedText}</Text>;
};

export default AnimatedText;
