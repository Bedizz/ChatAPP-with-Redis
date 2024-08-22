"use server"

import { Message } from "@/db/dummy";
import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { pusherServer } from "@/lib/pusher";

// Define the message type
type SendMessageActionArgs = {
	content: string;
	receiverId: string;
	messageType: "text" | "image";
};

export async function sendMessageAction({content,messageType,receiverId}:SendMessageActionArgs) {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
// If the user is not authenticated, return an error message
    if(!user) return {success: false, message: "User not authenticated"};

    const senderId = user.id;

    // Create a conversation id because redis works like 123:456 so we need to sort the ids
    const conversationId = `conversation:${[senderId, receiverId].sort().join(":")}`;

    // Check if the conversation exists
    const conversationExists = await redis.exists(conversationId); 
    // If the conversation does not exist, create a new conversation   
    if(!conversationExists) {
        await redis.hset(conversationId, {
            participant1: senderId,
            participant2: receiverId
        })
        // here we need to set two functions to create a conversation because we need to create a conversation for both the sender and the receiver otherwise the conversation will not be created for the receiver and the sender will not be able to send messages to the receiver
		await redis.sadd(`user:${senderId}:conversations`, conversationId);
		await redis.sadd(`user:${receiverId}:conversations`, conversationId);
    }


        // Generate a unique message id
        const messageId = `message:${Date.now()}:${Math.random().toString(36).substring(2,9)}`;
        const timestamp = Date.now();

        // create the message hash
	await redis.hset(messageId, {
		senderId,
		content,
		timestamp,
		messageType,
	});

        // zadd means put the message in the sorted set
        await redis.zadd(`${conversationId}:messages`,{score: timestamp, member: JSON.stringify(messageId)})

        // pusher doesnt allow us to use ":" instead we use "__"
        const channelName = `${senderId}__${receiverId}`.split("__").sort().join("__");

        await pusherServer?.trigger(channelName, "newMessage", {
            message: { senderId, content, timestamp, messageType },
        });
    
 
    
    return {success: true, conversationId, messageId}

}

export const getMessages =async (selectedUserId:string, currentUserId:string ) => {
    const conversationId = `conversation:${[selectedUserId, currentUserId].sort().join(":")}`;
    const messageIds= await redis.zrange(`${conversationId}:messages`, 0, -1);
    if(messageIds.length === 0 ) return [];

    const pipeline = redis.pipeline();
    messageIds.forEach((messageId) => {
        pipeline.hgetall(messageId as string)})
    const messages = (await pipeline.exec()) as Message[];
    return messages;
}