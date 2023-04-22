// import React, { useState } from "react";

// export const HeaderContext = React.createContext({
//   headerData: false,
//   setHeaderData: () => {},
// });
import React from "react";

interface HeaderContextProps {
  headerData: boolean;
  setHeaderData: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HeaderContext = React.createContext<HeaderContextProps>({
  headerData: false,
  setHeaderData: () => {},
});
