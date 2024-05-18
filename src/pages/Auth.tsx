import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from '../components'
import Input from '../components/UI/Input/Input'
import { useRegister } from '../hooks/auth/useRegister'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styles from '../style/Page/Home.module.scss'

const Auth = (): JSX.Element => {
  const { auth } = useTypedSelector((state) => state.authSlice)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')
  const { registerAsync, isLoading } = useRegister(email, password, login)
  const navigate = useNavigate()

  const onHandleSubmit = (): void => {
    void registerAsync()
    setEmail('')
    setPassword('')
    setLogin('')
  }

  useEffect(() => {
    if (auth) {
      navigate('/')
    }
  }, [auth, navigate])

  return (
    <Form className={styles.form} onSubmit={e => e.preventDefault()}>
        <h2 className={styles.title}>Регистрация React Chat</h2>
        <div className={styles.inputs}>
        <Input name="Почта" value={email} onChange={(e => setEmail(e.target.value))} placeholder="Почта" required />
        <Input name="Логин" value={login} onChange={(e => setLogin(e.target.value))} placeholder="Логин" required />
          <Input name="Пароль" type="password" value={password} onChange={(e => setPassword(e.target.value))} placeholder="Пароль" required />
        </div>
        <Button appearance="primary" onClick={() => onHandleSubmit()} disabled={isLoading}>Зарегистрироваться</Button>
    </Form>
  )
}

export default Auth
