import {useEffect, useState} from "react";

const useTopNavClass = () => {
  const [topNavClass, setTopNavClass] = useState('')

  useEffect(() => {
    const handleScroll = evt => {
      if(window.scrollY > 100){
        setTopNavClass('header-scrolled')
      }else {
        setTopNavClass('')
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {window.removeEventListener('scroll', handleScroll)}
  }, [])

  return topNavClass
}

export default useTopNavClass