/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { useRemoveAvatar } from '../../hooks/user/useRemoveAvatar'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import styles from './DragDropFile.module.scss'

interface DragDropFileProps {
  formDataRef: React.MutableRefObject<FormData | undefined>
}

const DragDropFile: React.FC<DragDropFileProps> = ({ formDataRef }) => {
  const avatar = useTypedSelector((state) => state.authSlice.user?.avatar)
  const [drag, setDrag] = React.useState(false)
  const [selectAvatar, setSelectedAvatar] = React.useState(false)
  const avatarRef = React.useRef<HTMLImageElement>(null)
  const formData = new FormData()

  React.useEffect(() => {
    if (avatarRef.current != null) {
      avatarRef.current.src = avatar as string
      setSelectedAvatar(false)
    }
  }, [avatar])

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(true)
  }

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(false)
  }

  const onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    const file = [...e.dataTransfer.files]
    if (!(/\.(jpe?g?|png|)$/).test(file[0].name)) {
      setDrag(false)
      return
    }
    formData.append('avatar', file[0])
    formDataRef.current = formData
    const reader = new FileReader()
    reader.readAsDataURL(file[0])
    reader.onload = function (event) {
      if (avatarRef.current != null) {
        avatarRef.current.src = event.target?.result as string
      }
    }
    setDrag(false)
    setSelectedAvatar(true)
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const file = e.target.files

    if (file != null) {
      if (!(/\.(jpe?g?|png|)$/).test(file[0].name)) {
        return
      }
      formData.append('avatar', file[0])
      const reader = new FileReader()
      formDataRef.current = formData
      reader.readAsDataURL(file[0])
      reader.onload = function (event) {
        if (avatarRef.current != null) {
          avatarRef.current.src = event.target?.result as string
        }
      }
    }
    setSelectedAvatar(true)
  }

  const { removeAvatar } = useRemoveAvatar()

  const onRemoveAvatar = (): void => {
    formData.delete('avatar')
    formDataRef.current = formData
    setSelectedAvatar(false)
    void removeAvatar()
  }

  const onRemoveNewAvatar = (): void => {
    if (avatarRef.current != null) {
      avatarRef.current.src = avatar as string
      formData.delete('avatar')
      formDataRef.current = formData
      setSelectedAvatar(false)
    }
  }

  return (
    <>{drag
      ? <div className={styles.drop_area}
      onDragStart={e => dragStartHandler(e)}
      onDragLeave={e => dragLeaveHandler(e)}
      onDragOver={e => dragStartHandler(e)}
      onDrop={e => onDropHandler(e)}
    >Отпустите файл, чтобы загрузить его</div>
      : <div className={styles.drop_area_active}
      onDragStart={e => dragStartHandler(e)}
      onDragLeave={e => dragLeaveHandler(e)}
      onDragOver={e => dragStartHandler(e)}
    ><label className={styles.input_file}>
      <input type="file" accept=".jpg, .jpeg, .png" onChange={e => onChangeInput(e)}/><span>Выберите файл</span></label><div className={styles.input_file_list}></div>
    </div>
  }
  {selectAvatar
    ? <div className={styles.newAvatar_wrapper}>
    <img ref={avatarRef} className={styles.newAvatar} alt="avatar" />
    <span onClick={() => onRemoveNewAvatar()} className={styles.newAvatar_remove}>x</span>
  </div>
    : avatar !== null
      ? <div className={styles.newAvatar_wrapper}>
    <img ref={avatarRef} src={avatarRef.current?.src} className={styles.newAvatar} alt="avatar" />
    <span onClick={() => onRemoveAvatar()} className={styles.newAvatar_remove}>x</span>
  </div>
      : null}
  </>
  )
}

export default DragDropFile
