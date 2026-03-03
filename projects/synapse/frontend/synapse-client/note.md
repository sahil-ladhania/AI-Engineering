# Chat Module Frontend Guide

---

## Section 1 — Key Concepts to Know Before Building

### 1. The Lazy Chat Creation Pattern
"New Chat" click must NOT call `createChatService`. It just clears local state.
The actual API call only fires when the user submits their **first message**.
This means your send-message handler has two branches:
- `activeChatId` is `null` → call `createChatService` first, get the real `chatId`, then call `sendMessageService`
- `activeChatId` exists → call `sendMessageService` directly

If you call create on every "New Chat" click, users who click it and leave create orphaned rows in your DB.

---

### 2. The URL is the Source of Truth for Which Chat is Active
You currently have only `/chat`. You need a second route: `/chat/:chatId`.
- "New Chat" click → navigate to `/chat` (no chatId, empty state)
- Clicking an existing chat in sidebar → navigate to `/chat/:chatId`
- After first message creates a chat → programmatically `navigate('/chat/' + newChatId)`

The `chatId` comes from `useParams()` in React Router. ChatArea reads it from the URL, not from Redux. This means the URL is always shareable and refreshable.

---

### 3. What Belongs in Redux vs Local State
**Redux (chatSlice):** `chats[]` list — needs to survive navigation and update the sidebar globally.
**Local state (ChatArea):** `messages[]`, `isStreaming`, `streamingContent` — these are UI-only and tied to the current view. Don't put messages in Redux. Fetch them fresh each time you enter a chat.

Also: don't persist `activeChatId` in redux-persist. Let the URL own that.

---

### 4. Optimistic Messages (Show Before Server Confirms)
When user hits send:
1. Immediately append the user message to local `messages` state — don't wait for the server.
2. Immediately append a placeholder AI message with `streaming: true` and empty content.
3. As stream chunks arrive, keep updating that placeholder's content in state.
4. On stream end, mark it settled.
5. On error, remove the user message and placeholder, show a toast.

This is what makes the UI feel instant. The user should never stare at a blank screen after hitting send.

---

### 5. `streamMessageService` Cannot Use Axios
Axios's `responseType: 'stream'` only works in Node.js. In the browser it silently falls back to waiting for the full response — meaning you get no streaming at all.

For browser streaming you must use the native `fetch` API with `response.body.getReader()`. The reader gives you `Uint8Array` chunks which you decode with `TextDecoder` and accumulate into a string.

Your current `streamMessageService` in chatServices.ts will need to be rewritten to use `fetch` directly. This is the one exception where axios is not the right tool.

---

### 6. AbortController — The Correct Way to Cancel Streams
Store an `AbortController` in a `useRef` inside ChatArea. On every new send:
- Abort the previous controller (in case one is still running)
- Create a fresh controller
- Pass its `signal` to the `fetch` call

Also abort it in the `useEffect` cleanup that runs when the component unmounts or when `chatId` changes. Without this, a stream from chat A will keep writing into the state of chat B after you switch.

---

### 7. Auto-Scroll Without Fighting the User
You need a `useRef` on a dummy `<div>` at the bottom of the message list. Call `.scrollIntoView()` on it whenever messages change or a stream chunk arrives.

The subtle part: if the user has manually scrolled up to read older messages, don't yank them back down on every chunk. Track a boolean `isAtBottom` — only auto-scroll when it's `true`. Set it to `false` on scroll-up, `true` when they scroll back to the bottom.

---

### 8. Loading State is Local, Not Global
`isStreaming` is a boolean in ChatArea's local state, not in Redux. When `true`:
- Disable the InputBar submit button
- Show a stop/cancel button that calls `abortController.current.abort()`
- Optionally disable the "New Chat" button in Sidebar (pass it as a prop)

---

### 9. After Creating a Chat, Update the Sidebar Immediately
When `createChatService` resolves and you have the new chat object, dispatch `addChat(newChat)` to Redux immediately. Don't wait for the next `getChatsService` poll. The sidebar is connected to the Redux `chats[]` array, so it will update automatically.

Then navigate to `/chat/${newChat.id}`. Set the chat title to the first few words of the user's first message (or whatever your backend returns).

---

### 10. Fetching Chat History (Messages) on Chat Switch
When the user navigates to `/chat/:chatId`, use a `useEffect` that depends on `chatId`. Inside it: clear the current messages, then call `getChatMessagesService(chatId)` and set the result into local state.

The clear-then-fetch pattern prevents stale messages from the previous chat flashing on screen before the new ones load.

---

## Section 2 — Step-by-Step Implementation Order

### Step 1 — Define Types
Create your TypeScript types before touching any component.
- `Chat`: `id`, `title`, `createdAt`, `updatedAt`
- `Message`: `id`, `chatId`, `role` (`'user' | 'ai'`), `content`, `createdAt`, `tokens`
Put them in `src/types/chat.ts` (this file likely already exists — check and extend it).

---

### Step 2 — Create the chatSlice in Redux
New file: `src/store/slices/chatSlice.ts`
State shape: `{ chats: Chat[], activeChatId: string | null }`
Actions needed: `setChats`, `addChat`, `removeChat`, `updateChatTitle`, `setActiveChat`
Register it in `store/config.ts` under the root reducer. Add it to the persist whitelist so the sidebar doesn't flash empty on reload. Do NOT persist `activeChatId`.

---

### Step 3 — Add the `/chat/:chatId` Route
In `router.tsx`, add `{ path: '/chat/:chatId', element: <ChatPage /> }` under the existing ProtectedRoute children alongside `/chat`.
ChatPage reads `const { chatId } = useParams()` and passes it down to ChatArea.

---

### Step 4 — Fetch Chat List on App Load
In `ChatPage`, on mount (useEffect with empty deps), call `getChatsService()` and dispatch `setChats(result)`.
In `Sidebar`, replace the hardcoded `CHAT_HISTORY` constant with the Redux `chats` array via `useSelector`.

---

### Step 5 — Wire Up Sidebar Chat Clicks
Each chat item in the sidebar should `navigate('/chat/' + chat.id)` on click.
Highlight the active one by comparing `chat.id` to the current `chatId` from `useParams()` — not from Redux. Let the URL drive which is active.

---

### Step 6 — Wire Up "New Chat" Button
On click: navigate to `/chat`. That's it. No API call.
In ChatArea, when `chatId` is undefined (the `/chat` route), show the empty welcome state instead of messages.

---

### Step 7 — Load Messages When Chat Changes
In ChatArea, a `useEffect` on `chatId`:
- If `chatId` is undefined → clear messages and return (welcome screen)
- If `chatId` exists → clear messages, call `getChatMessagesService(chatId)`, set result into local state

---

### Step 8 — Build Send Message Flow (Non-Streaming First)
This is the core logic. In ChatArea's submit handler:
1. If `chatId` is undefined (new chat): call `createChatService({ title: firstFewWords })`, get back the new chat, dispatch `addChat`, then navigate to `/chat/${newChat.id}`, and use the returned `chatId` going forward
2. Optimistically append the user message to local messages state
3. Append an AI placeholder message with `streaming: false, content: 'Thinking...'`
4. Call `sendMessageService(chatId, { content })`
5. Replace the placeholder with the actual response
6. On error, remove both the user message and placeholder

Get this working before touching streaming.

---

### Step 9 — Replace Send With Streaming
Now swap `sendMessageService` for a `fetch`-based streaming call.
- Rewrite `streamMessageService` to use `fetch` + `response.body.getReader()`
- On each chunk: decode it, append to `streamingContent` state, which the placeholder AI bubble reads from
- On stream end: finalize the message in state
- Wire up AbortController via `useRef` as described in Section 1 point 6

---

### Step 10 — Wire Up Delete Chat
Add a delete icon to each sidebar chat item (visible on hover).
On click: call `deleteChatService(chatId)`, dispatch `removeChat(chatId)`.
If the deleted chat was the active one, navigate to `/chat`.

---

### Step 11 — Wire Up Rename Chat
Add an edit/rename affordance to sidebar chat items (double-click or pencil icon).
On confirm: call `updateChatService(chatId, { title: newTitle })`, dispatch `updateChatTitle({ id: chatId, title: newTitle })`.

---

### Step 12 — Wire Up Usage Display
In Sidebar's footer where "Session Cost: $0.0024" is hardcoded, fetch real data from `getUsageService()` on ChatPage mount and pass it down. Display the real cost/token count.
