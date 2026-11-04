// routes/chatRoute.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

router.post('/chat', chatLimiter, async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Message must be a non-empty string.' });
    return;
  }

  if (message.length > 2500) {
    res.status(400).json({ error: 'Message exceeds maximum allowed length of 2500 characters.' });
    return;
  }

  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are IntelliBot, an intelligent and friendly academic assistant on the IntelliQuest e-learning platform.
Your goals:
- Help students understand complex concepts in programming, mathematics, AI, cybersecurity, and computer science.
- Provide clear, well-structured, concise, and engaging explanations.
- Guide students toward relevant courses on IntelliQuest when appropriate.
- Format key terms with bold (**term**) for readability.`;

  // 1. Try Groq if key is available
  if (groqKey) {
    try {
      const groqResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'qwen/qwen3.8-27b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message.trim() },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const reply = groqResponse.data?.choices?.[0]?.message?.content;
      if (reply) {
        res.json({ reply });
        return;
      }
    } catch (groqError: any) {
      console.warn('Groq API attempt failed:', groqError?.response?.data || groqError.message);
    }
  }

  // 2. Try OpenRouter if key is available
  if (openRouterKey && !openRouterKey.startsWith('sk-or-v1-0830d4bce')) {
    try {
      const openRouterResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message.trim() },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const reply = openRouterResponse.data?.choices?.[0]?.message?.content;
      if (reply) {
        res.json({ reply });
        return;
      }
    } catch (openRouterError: any) {
      console.warn('OpenRouter API attempt failed:', openRouterError?.response?.data || openRouterError.message);
    }
  }

  // 3. Fallback graceful response if external providers are unreachable
  const fallbackReply = `Hello! I am **IntelliBot**, your academic guide on **IntelliQuest**. 

I am currently running in offline fallback mode while connecting to the primary AI engine. You can explore courses in **Computer Science**, **Machine Learning**, **Data Structures**, and **Cybersecurity** from your dashboard or ask specific course-related questions!`;

  res.json({ reply: fallbackReply });
});

export default router;
