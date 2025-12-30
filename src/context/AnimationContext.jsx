import React, { createContext, useContext, useState } from 'react';

// Context to signal when loader is complete and animations should start
const AnimationContext = createContext({
    animationReady: false,
    setAnimationReady: () => { }
});

export const AnimationProvider = ({ children }) => {
    const [animationReady, setAnimationReady] = useState(false);

    return (
        <AnimationContext.Provider value={{ animationReady, setAnimationReady }}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimationReady = () => useContext(AnimationContext);

export default AnimationContext;
