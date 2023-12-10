import { memo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { routesOutside } from "routers/routes"

interface Props {

}

const HomePage = memo((props: Props) => {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language) {
      window.location.href = routesOutside(i18n.language).overview
    }
  }, [i18n.language])

  return null
})

export default HomePage