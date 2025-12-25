
import React, { createContext, useContext, useState, ReactNode } from "react";

type MobileMenuContextType = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const MobileMenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  return context;
};
