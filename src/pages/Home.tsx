/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { FC, memo, useEffect, useState } from 'react'
import { AsideFriends, Button, ChatContainer, Form } from '../components'
import Input from '../components/UI/Input/Input'
import { useLogin } from '../hooks/auth/useLogin'
import styles from '../style/Page/Home.module.scss'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useLocation, useNavigate } from 'react-router-dom'
import socket from '../service/chat/socket.service'
import { useAction } from '../hooks/useAction'

const Home: FC = memo(() => {
  const { auth } = useTypedSelector((state) => state.authSlice)
  const { userOnline } = useTypedSelector((state) => state.userSlice)
  const [emailOrLogin, setEmailOrLogin] = useState('')
  const [password, setPassword] = useState('')
  const { loginAsync, isLoading } = useLogin(emailOrLogin, password)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.search || location.state?.from?.pathname
  const { onSendReguesFriend, onAcceptReguesFriend, setOnline } = useAction()

  const onHandleSubmit = (): void => {
    void loginAsync()
    setEmailOrLogin('')
    setPassword('')
  }

  useEffect(() => {
    socket.on('ADD-USER-STATUS', (data: String[]) => {
      const is_same = (userOnline.length === data.length) && userOnline.every(el => data.includes(el))
      if (!is_same) {
        setOnline(data)
      }
    })
    return () => {
      socket.off('ADD-USER-STATUS')
    }
  }, [setOnline])

  useEffect(() => {
    if (auth) {
      navigate(from, { replace: true })
      socket.connect()
    }
  }, [auth, from, navigate])

  useEffect(() => {
    if (auth) {
      socket.on('reguest:user-recieve', ({ request }) => {
        onSendReguesFriend(request.sender)
      })
    }
  }, [])

  useEffect(() => {
    if (auth) {
      socket.on('accept:user-recieve', ({ request }) => {
        onAcceptReguesFriend(request.taker)
      })
    }
  }, [])

  if (!auth) {
    return (
      <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <h2 className={styles.title}>Вход React Chat</h2>
        <div className={styles.inputs}>
          <Input name="Почта" value={emailOrLogin} onChange={(e => setEmailOrLogin(e.target.value))} placeholder="E-mail или Логин" required />
          <Input name="Пароль" type="password" value={password} onChange={(e => setPassword(e.target.value))} placeholder="Пароль" required />
        </div>
        <Button appearance="primary" onClick={() => onHandleSubmit()} disabled={isLoading}>
          Войти
        </Button>
      </Form>
    )
  }

  return (
    <>
      <div className={styles.inbox}>
        <AsideFriends/>
        <main>
          <ChatContainer/>
        </main>
      </div>
    </>
  )
})

export default Home
