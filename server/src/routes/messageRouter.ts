import {Router} from "express";
import { protect } from "../middleware/authMiddileware";
import { validate } from "../middleware/validation";
import { checkConversation, deleteMessage, getConversationMessages, sendMessage } from "../controllers/messageController";
import { createMessageSchema, deleteMessageSchema, getConversationMessagesSchema } from "../validators/messageValidator";
import { getUserInbox } from "../models/messageModel";


const router = Router();
router.use(protect);

router.get("/conversation/:listingId",checkConversation);
router.post("/send",validate(createMessageSchema), sendMessage);
router.delete("/delete/:messageId",validate(deleteMessageSchema), deleteMessage);

router.get("/inbox", getUserInbox);
router.get("/conversation/:conversationId", validate(getConversationMessagesSchema), getConversationMessages);