import { createContext, useState } from 'react'

const CurrencySymbolContext = createContext({})

export default CurrencySymbolContext;

export const CurrencyProvider = props => {
  const {children} = props;
  const [showInEth, setShowInEth] = useState(true);
  return (
    <CurrencySymbolContext.Provider value={{showInEth, setShowInEth}}>
      {children}
    </CurrencySymbolContext.Provider>
  )
}