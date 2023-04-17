import React, { useState } from "react";

export const HeaderContext = React.createContext({
  headerData: false,
  setHeaderData: () => {},
});
