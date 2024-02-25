'use client';

import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import PageClass from './page.module.css'

export default function Page() {

  const { sendMessage, messages } = useSocket()
  const [message, setMessage] = useState('')

  return (
    <div className={PageClass["center"]}>
      <div className={PageClass["chat-container"]}>
        <div className={PageClass["chat-box"]}>
          {
            messages.length > 0 && messages.map(message => (
              <span className={PageClass["chat-message"]} key={message}>{message}</span>
            ))
          }
        </div>
        <div className={PageClass["chat-cta"]}>
          <input type="text" onChange={e => setMessage(e.target.value)} />
          <button onClick={() => sendMessage(message)}>Send</button>
        </div>
      </div>
    </div>
  )
}