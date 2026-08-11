// app.js
let smartReplyRequestId = 0;
let typingRequestId = 0;
let suggestionTimer = null;
let groups = [];
let conversations = [];

const chatForm = document.getElementById("chatForm");

const messageInput = document.getElementById("messageInput");

const typingSuggestions = document.getElementById("typingSuggestions");

window.addEventListener("DOMContentLoaded", async () => {
  console.log("Chat Application Started");

  await loadGroups();

  await loadConversations();
});

messageInput.addEventListener("input", handleTyping);
chatForm.addEventListener("submit", sendMessage);
document.getElementById("searchBtn").addEventListener("click", searchUser);


function renderConversationList() {

    const conversationList =
        document.getElementById(
            "conversationList"
        );

    conversationList.innerHTML = "";

    // =========================
    // GROUPS
    // =========================

    groups.forEach((group) => {

        const div =
            document.createElement("div");

        div.className = "user";

        div.innerHTML = `
            <h4>
                👥 ${group.groupName}
            </h4>

            <p>
                Group Chat
            </p>
        `;

        div.addEventListener(
            "click",
            () => openGroup(group)
        );

        conversationList.appendChild(div);

    });


    // =========================
    // PERSONAL CONVERSATIONS
    // =========================

    conversations.forEach((user) => {

        const div =
            document.createElement("div");

        div.className = "user";

        div.innerHTML = `
            <h4>
                👤 ${user.username}
            </h4>

            <p>
                ${user.email}
            </p>
        `;

        div.addEventListener(
            "click",
            () => openChat(
                user.email,
                user.username
            )
        );

        conversationList.appendChild(div);

    });
}

function resetAIState() {
  // Invalidate previous smart-reply request
  smartReplyRequestId++;

  // Invalidate previous typing request
  typingRequestId++;

  // Cancel typing timer
  clearTimeout(suggestionTimer);

  // Clear UI
  clearTypingSuggestions();
  clearSmartReplies();
}

function sendMessage(e) {
  e.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  // Group Selected
  if (selectedGroupId) {
    sendGroupMessage(message);
  }

  // Personal Selected
  else if (selectedEmail) {
    sendPersonalMessage(message);
  } else {
    return alert("Select a user or group");
  }

  messageInput.value = "";
  // clearTypingSuggestions();
  // clearSmartReplies();
  resetAIState();
}

function handleTyping() {
  const text = messageInput.value.trim();

  // Empty input
  if (!text) {
    typingRequestId++;

    clearTypingSuggestions();

    return;
  }

  clearTimeout(suggestionTimer);

  suggestionTimer = setTimeout(() => {
    getTypingSuggestions(text);
  }, 500);
}

async function getTypingSuggestions(text) {
  const requestId = ++typingRequestId;

  try {
    const res = await axios.post(
      "http://localhost:3000/ai/predict",
      {
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${window.token}`,
        },
      },
    );

    // Ignore old request
    if (requestId !== typingRequestId) {
      return;
    }

    showTypingSuggestions(res.data.suggestions);
  } catch (err) {
    if (requestId !== typingRequestId) {
      return;
    }

    console.error("Typing suggestion error:", err.response?.data || err);

    clearTypingSuggestions();
  }
}

function showTypingSuggestions(suggestions) {
  typingSuggestions.innerHTML = "";

  if (!suggestions || suggestions.length === 0) {
    return;
  }

  suggestions.forEach((suggestion) => {
    const button = document.createElement("button");

    button.type = "button";

    button.className = "ai-suggestion";

    button.innerText = suggestion;

    button.addEventListener("click", () => {
      addSuggestionToInput(suggestion);
    });

    typingSuggestions.appendChild(button);
  });
}

function addSuggestionToInput(suggestion) {
  const currentText = messageInput.value.trim();

  if (!currentText) {
    messageInput.value = suggestion;
  } else {
    messageInput.value = `${currentText} ${suggestion}`;
  }

  clearTypingSuggestions();

  messageInput.focus();
}

async function useSmartReply(reply) {
  if (selectedGroupId) {
    sendGroupMessage(reply);
  } else if (selectedEmail) {
    await sendPersonalMessage(reply);
  } else {
    return alert("Select a user or group");
  }

  clearSmartReplies();
}

async function generateSmartReplies(message) {
  // Create unique ID for this request
  const requestId = ++smartReplyRequestId;

  // Remember which conversation was active
  const conversationAtRequestTime = selectedGroupId
    ? `group_${selectedGroupId}`
    : selectedEmail
      ? `user_${selectedEmail}`
      : null;

  try {
    const res = await axios.post(
      "http://localhost:3000/ai/smart-replies",
      {
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${window.token}`,
        },
      },
    );

    // Another request became newer
    if (requestId !== smartReplyRequestId) {
      return;
    }

    // User changed conversation
    const currentConversation = selectedGroupId
      ? `group_${selectedGroupId}`
      : selectedEmail
        ? `user_${selectedEmail}`
        : null;

    if (currentConversation !== conversationAtRequestTime) {
      return;
    }

    // Only now show replies
    showSmartReplies(res.data.replies);
  } catch (err) {
    // Ignore cancelled/old requests
    if (requestId !== smartReplyRequestId) {
      return;
    }

    console.error("Smart reply error:", err.response?.data || err);

    clearSmartReplies();
  }
}
