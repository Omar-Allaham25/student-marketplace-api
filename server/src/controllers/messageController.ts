import { Request, Response, NextFunction } from "express";
import { getIo } from "../socket";
import {
  createMessage,
  deleteMessage as deleteMessageServices,
  getConversationByListing,
  getUserInbox,
  getConversationMessages as getConversationMessagesServices,
} from "../models/messageModel";
import { AppError } from "../utils/appError";
const io = getIo();

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { listingId, content } = req.body;
    const senderId = req.user?.userId;
    if (!senderId) throw new AppError("user id not provided", 400);
    const message = await createMessage(senderId, content, listingId);
    io.to(`chat_${message.conversationId}`).emit("new_message", message);
    const receverId =
      message.conversation.sellerId === senderId
        ? message.conversation.buyerId
        : message.conversation.sellerId;
    io.to(`user_${receverId}`).emit("inbox_notification", {
      conversationId: message.conversationId,
      unreadCount: 1,
      latestMessage: message,
    });
    res.status(201).json({
      status: "success",
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.messageId as string;
    const userId = req.user?.userId;
    if (!userId) throw new AppError("user id not provided", 400);
    const deletedMessage = await deleteMessageServices(id, userId);
    io.to(`chat_${deletedMessage.conversationId}`).emit("message_deleted", {
      messageId: deletedMessage.id,
      conversationId: deletedMessage.conversationId,
    });
    res.status(200).json({
      status: "success",
      message: "Message deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const checkConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.listingId as string;
    const buyerId = req.user?.userId;
    if (!buyerId) throw new AppError("user id not provided", 400);
    const conversation = await getConversationByListing(buyerId, id);
    res.status(200).json({
      status: "success",
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const getInbox = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("user id not provided", 400);
    const inbox = await getUserInbox(userId);
    res.status(200).json({
      status: "success",
      data: inbox,
    });
  } catch (err) {
    next(err);
  }
};

export const getConversationMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const conversationId = req.params.conversationId as string;
    const userId = req.user?.userId;
    if (!userId) throw new AppError("user id not provided", 400);
    const messages = await getConversationMessagesServices(
      conversationId,
      userId,
    );
    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};
