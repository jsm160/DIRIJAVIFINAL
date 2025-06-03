import { useTranslation } from 'react-i18next'

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      <button onClick={() => changeLanguage('es')}>🇪🇸 Español</button>
      <button onClick={() => changeLanguage('en')}>🇬🇧 English</button>
    </div>
  )
}
