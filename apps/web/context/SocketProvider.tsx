'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketProviderPros {
    children?: React.ReactNode
}


interface ISocketContext {
    sendMessage: (msg: string) => any,
    messages: string[]
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);

    if (!state) throw new Error(`State is undefined`);

    return state;
}

export const SocketProvider: React.FC<SocketProviderPros> = ({ children }) => {

    const [socket, setSocket] = useState<Socket | undefined>()
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage: ISocketContext['sendMessage'] = useCallback(msg => {
        console.log("Message", msg);
        socket?.emit('event:message', { message: msg })
    }, [socket])

    const onMessageRecieve = useCallback((msg: string) => {
        console.log(msg)
        const { message } = JSON.parse(msg) as { message: string }
        console.log(message)
        setMessages(prev => [...prev, message]);
    }, [])

    useEffect(() => {
        const _socket = io('http://localhost:8000')

        _socket.on("redis:message", onMessageRecieve)

        setSocket(_socket)

        return () => {
            _socket.off('redis:message', onMessageRecieve)
            _socket.disconnect();
            setSocket(undefined)
        };
    }, [])

    return ((
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    ))
}