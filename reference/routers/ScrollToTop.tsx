import { PROJECT_DETAIL_SECTION } from "models/project";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

 const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById(PROJECT_DETAIL_SECTION.content)?.scrollTo(0, 0)
    document.getElementById("basic-content")?.scrollTo(0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;