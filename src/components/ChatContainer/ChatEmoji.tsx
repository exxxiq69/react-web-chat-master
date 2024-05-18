/* eslint-disable react/display-name */
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import React, { ForwardedRef, useRef } from 'react'
import { ReactComponent as Emoji } from '../../assets/emoji.svg'
import useHover from '../../hooks/useHover'

interface ChatEmojiProps {
  onClick: (emojiData: EmojiClickData, event: MouseEvent) => void
}

const ChatEmoji = React.forwardRef(({ onClick, ...props }: ChatEmojiProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const emojiRef = useRef(null!)
  const showEmojiPicker = useHover(emojiRef, { enterDelay: 200, leaveDelay: 200 })
  return (
    <div ref={emojiRef} {...props}>
    <Emoji />
    {showEmojiPicker && <EmojiPicker
            onEmojiClick={onClick}
            autoFocusSearch={false}
            height={350}
            searchDisabled
            lazyLoadEmojis={true}
            skinTonesDisabled
              /> }
    </div>
  )
})

export default ChatEmoji
