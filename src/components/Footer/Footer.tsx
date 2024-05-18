import { FC } from 'react'
import { ThemeButton } from '..'
import { useTheme } from '../../hooks/useTheme'
import styles from './Footer.module.scss'

const Footer: FC = () => {
  const { theme, setTheme } = useTheme()

  const changeTheme = (): void => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }
  return (
    <footer className={styles.footer}>
      <h3> © by exxxiq69, 2024</h3>
      <ThemeButton appearance={theme === 'light' ? 'light' : 'dark'} onClick={changeTheme}/>
    </footer>
  )
}

export default Footer
