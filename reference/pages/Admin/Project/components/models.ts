import { ProjectAttribute } from "models/project_attribute"

export const renderLanguageAttribute = (projectAttribute: ProjectAttribute, key: string, lang: string) => {

    if (!projectAttribute.attribute?.[key]) return ""

    const languageValue = projectAttribute.attribute.languages.find((item) => item.language === lang)
    
    if (languageValue?.[key]) return `${projectAttribute.attribute?.[key]} (${languageValue[key]})`
    
    return projectAttribute.attribute[key]
  }