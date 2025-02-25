import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useAppSelector } from '@/core/redux/hooks';
import { MessagesAPIs, IMessageParams } from '@/core/apis/messagesAPIs';
import { joinConversation, leaveConversation, sendMessageSocket, initSocket } from '@/core/apis/socketAPIs';
import { Message } from '@/configs/type';
import { useRoute } from '@react-navigation/native';
import { Socket } from 'socket.io-client';

export default function ChatScreen() {
  const route = useRoute();
  const { conversationId } = route.params as { conversationId: string };
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { profile } = useAppSelector(state => state.reducer.me);
  const [socket, setSocket] = useState<Socket | undefined>();
  const socketRef = useRef<Socket | undefined>();

  const initializeSocket = useCallback(async () => {
    const newSocket = await initSocket();
    setSocket(newSocket);
    socketRef.current = newSocket;
    return newSocket;
  }, []);

  const setupSocketListeners = useCallback((socket: Socket) => {
    socket.on('newMessage', (data: { message: Message, conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages(previousMessages => [mapMessageToIMessage(data.message), ...previousMessages]);
      }
    });
  }, [conversationId]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await MessagesAPIs.getMessagesByConservationId(conversationId);
      setMessages(response.map(mapMessageToIMessage));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [conversationId]);

  useEffect(() => {
    const setup = async () => {
      const newSocket = await initializeSocket();
      setupSocketListeners(newSocket);
      fetchMessages();
      joinConversation(newSocket, profile?._id??"", conversationId);
    };

    setup();

    return () => {
      if (socketRef.current) {
        leaveConversation(socketRef.current, profile?._id??"", conversationId);
      }
    };
  }, [conversationId, initializeSocket, setupSocketListeners, fetchMessages]);

  const mapMessageToIMessage = useCallback((msg: Message): IMessage => {
    return {
      _id: msg._id??"",
      text: msg.content,
      createdAt: new Date(msg.createdAt),
      user: {
        _id: msg.sender._id??"",
        name: msg.sender.displayName,
        avatar: msg.sender.avatar,
      },
    };
  }, []);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const [message] = newMessages;
    try {
      const params: IMessageParams = {
        senderId: profile?._id??"",
        content: message.text,
        messageType: 'text',
        conversationId: conversationId
      };
      const res = await MessagesAPIs.sendMessage(params);
      const newIMessage = mapMessageToIMessage(res);
      setMessages(previousMessages => [newIMessage, ...previousMessages]);

      if (socket) {
        sendMessageSocket(socket, {
          senderId: profile?._id??"",
          conversationId: conversationId,
          content: message.text,
          messageType: 'text',
          _id:res._id
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [profile, conversationId, socket, mapMessageToIMessage]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: profile?._id??""}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
