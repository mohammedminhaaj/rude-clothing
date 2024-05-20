'use client';

import {
	MessageItem,
	MessageType,
	useMessageContext,
} from '@/store/MessageProvider';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'react-feather';

import { AnimatePresence, motion } from 'framer-motion';

type MessageMeta = {
	icon: JSX.Element;
	color: string;
};

const getMessageMeta: (type: MessageType) => MessageMeta = (
	type: MessageType
) => {
	switch (type) {
		case MessageType.SUCCESS:
			return {
				icon: <CheckCircle />,
				color: 'bg-green-200',
			};
		case MessageType.WARNING:
			return {
				icon: <AlertCircle />,
				color: 'bg-orange-200',
			};
		case MessageType.ERROR:
			return {
				icon: <XCircle />,
				color: 'bg-red-200',
			};
		case MessageType.INFO:
			return {
				icon: <Info />,
				color: 'bg-blue-200',
			};
	}
};

const Toast = () => {
	const { messages, removeMessage } = useMessageContext();
	const onClose = (id: string) => {
		removeMessage(id);
	};
	return (
		<AnimatePresence>
			{!!messages.length && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					key={'toast-group'}
					className='fixed right-1/2 translate-x-1/2 flex flex-col items-center gap-2 top-2 w-10/12 md:w-1/3 z-50'>
					<AnimatePresence>
						{messages.map((item: MessageItem) => {
							const messageMeta: MessageMeta = getMessageMeta(
								item.type
							);
							return (
								<motion.div
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									key={item.id}
									transition={{
										type: 'spring',
										stiffness: 100,
									}}
									whileHover={{ opacity: 0.8 }}
									className={`${messageMeta.color} flex gap-3 items-center rounded w-full p-3`}>
									<em className='basis-1/12 animate-pulse'>
										{messageMeta.icon}
									</em>
									<p className='basis-10/12 text-sm font-extralight capitalize'>
										{item.message}
									</p>
									<button
										onClick={() => onClose(item.id)}
										type='button'
										title='Close Notification'
										className='basis-1/12'>
										<X className='transition hover:scale-110 duration-300' />
									</button>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Toast;
