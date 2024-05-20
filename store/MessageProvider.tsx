import { nanoid } from 'nanoid';
import { createContext, useCallback, useContext, useState } from 'react';

export enum MessageType {
	SUCCESS,
	INFO,
	WARNING,
	ERROR,
}

export type MessageItem = {
	id: string;
	message: string;
	type: MessageType;
};

interface MessageContextProps {
	messages: MessageItem[];
	insertMessage: (message: string, type: MessageType) => void;
	shiftMessage: () => void;
	removeMessage: (messageId: string) => void;
}

const MessageContext = createContext<MessageContextProps>({
	messages: [],
	insertMessage: () => {},
	shiftMessage: () => {},
	removeMessage: () => {},
});

export const MessageProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [messages, setMessages] = useState<MessageItem[]>([]);

	const insertMessage = useCallback((message: string, type: MessageType) => {
		setMessages((previous: MessageItem[]) => [
			...previous,
			{ message, type, id: nanoid() },
		]);
	}, []);

	const shiftMessage = useCallback(() => {
		setMessages((previous: MessageItem[]) => {
			const tempArray: MessageItem[] = [...previous];
			tempArray.shift();
			return tempArray;
		});
	}, []);

	const removeMessage = useCallback((messageId: string) => {
		setMessages((previous: MessageItem[]) =>
			previous.filter((message: MessageItem) => message.id !== messageId)
		);
	}, []);

	return (
		<MessageContext.Provider
			value={{ messages, insertMessage, shiftMessage, removeMessage }}>
			{children}
		</MessageContext.Provider>
	);
};

export const useMessageContext: () => MessageContextProps = () =>
	useContext(MessageContext);
