/* =========================================================
   PRIYANSHU AI PORTFOLIO CHATBOT
========================================================= */

const chatbot = {
    messages: [],
    isOpen: false,
    isLoading: false
};


/* =========================================================
   OPEN CHATBOT
========================================================= */

function openChatbot() {

    chatbot.isOpen = true;

    const chatWindow =
        document.getElementById("ai-chat-window");

    if (chatWindow) {
        chatWindow.classList.add("active");
    }

    hideChatNotification();
}


/* =========================================================
   CLOSE CHATBOT
========================================================= */

function closeChatbot() {

    chatbot.isOpen = false;

    const chatWindow =
        document.getElementById("ai-chat-window");

    if (chatWindow) {
        chatWindow.classList.remove("active");
    }
}


/* =========================================================
   NOTIFICATION
========================================================= */

function hideChatNotification(event) {

    if (event) {
        event.stopPropagation();
    }

    const notification =
        document.getElementById("ai-chat-notification");

    if (!notification) return;

    notification.classList.add("hide");

    setTimeout(function () {

        notification.style.display = "none";

    }, 350);
}


/* =========================================================
   ADD MESSAGE
========================================================= */
function formatAIResponse(text) {

    if (!text) return "";


    /* -----------------------------------------
       Escape HTML for safety
    ----------------------------------------- */

    let formatted =
        text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");


    /* -----------------------------------------
       Bold
       **text**
    ----------------------------------------- */

    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    /* -----------------------------------------
       Headings
       ### Heading
    ----------------------------------------- */

    formatted =
        formatted.replace(
            /^### (.*)$/gm,
            '<div class="ai-response-heading">$1</div>'
        );


    /* -----------------------------------------
       Bullet points
       - item
       * item
    ----------------------------------------- */

    formatted =
        formatted.replace(
            /^[*-]\s+(.*)$/gm,
            '<div class="ai-response-bullet"><span>•</span><span>$1</span></div>'
        );


    /* -----------------------------------------
       Numbered lists
    ----------------------------------------- */

    formatted =
        formatted.replace(
            /^(\d+)\.\s+(.*)$/gm,
            '<div class="ai-response-number"><span>$1.</span><span>$2</span></div>'
        );


    /* -----------------------------------------
       New lines
    ----------------------------------------- */

    formatted =
        formatted.replace(
            /\n\n/g,
            '<div class="ai-response-gap"></div>'
        );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;
}
function addMessage(role, text, actions = []) {

    const messagesContainer =
        document.getElementById("ai-chat-messages");

    if (!messagesContainer) return;


    const messageElement =
        document.createElement("div");

    messageElement.className =
        "ai-message " + role;


    /* =========================================
       MESSAGE CONTENT
    ========================================= */

    if (role === "assistant") {

        messageElement.innerHTML =
            formatAIResponse(text);

    } else {

        messageElement.textContent =
            text;
    }


    messagesContainer.appendChild(
        messageElement
    );


    /* =========================================
       ACTION BUTTONS
    ========================================= */

    if (
        role === "assistant" &&
        Array.isArray(actions) &&
        actions.length > 0
    ) {

        const actionContainer =
            document.createElement("div");

        actionContainer.className =
            "ai-action-buttons";


        actions.forEach(action => {

            if (
                !action ||
                !action.url ||
                !action.label
            ) {
                return;
            }


            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "ai-action-button";


            button.innerHTML = `
                <span>${action.icon || "→"}</span>
                <span>${action.label}</span>
            `;


            button.addEventListener(
                "click",
                () => {

                    window.open(
                        action.url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );


            actionContainer.appendChild(
                button
            );

        });


        if (
            actionContainer.children.length > 0
        ) {

            messagesContainer.appendChild(
                actionContainer
            );

        }
    }


    /* =========================================
       AUTO SCROLL
    ========================================= */

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}
function getContextualActions(text) {

    const content =
        text.toLowerCase();

    const actions = [];

    /*
     * TurfBook
     */

    if (
        content.includes("turfbook") ||
        content.includes("turf book")
    ) {

        actions.push({

            icon: "🚀",

            label: "Live Demo",

            url:
                "https://turfbook-pdod.onrender.com"

        });

        actions.push({

            icon: "💻",

            label: "Source Code",

            url:
                "https://www.github.com/Priyansh2811/TurfBook"

        });
    }


    /*
     * Resume
     */

    if (
        content.includes("resume") ||
        content.includes("cv")
    ) {

        actions.push({

            icon: "📄",

            label: "View Resume",

            url:
                "https://drive.google.com/file/d/1z08Z1IJIAojT2clAEB1ckpQ_DXsAMZP4/view?usp=drive_link"

        });
    }


    /*
     * Coding Analytics
     */

    if (
        content.includes("coding analytics") ||
        content.includes("leetcode") ||
        content.includes("hackerrank")
    ) {

        actions.push({

            icon: "📊",

            label: "Coding Profile",

            url:
                "https://codolio.com/profile/Priyanshu_28"

        });
    }


    /*
     * Certifications
     */

    if (
        content.includes("certification") ||
        content.includes("credential") ||
        content.includes("badge")
    ) {

        actions.push({

            icon: "🏆",

            label: "View Credentials",

            url:
                "https://www.credly.com/users/priyanshu-nautiyal"

        });
    }


    return actions;
}

/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping() {

    const messagesContainer =
        document.getElementById("ai-chat-messages");

    if (!messagesContainer) return;

    // Remove an existing indicator first
    hideTyping();

    const typing = document.createElement("div");

    typing.id = "ai-typing";
    typing.className = "ai-typing";

    typing.innerHTML = `
        <div class="ai-typing-avatar">
            ✦
        </div>

        <div class="ai-typing-bubble">
            <div class="ai-typing-text">
                Priyanshu AI is thinking
            </div>

            <div class="ai-typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typing);

    requestAnimationFrame(() => {

        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: "smooth"
        });

    });
}

/* =========================================================
   HIDE TYPING
========================================================= */

function hideTyping() {

    const typing =
        document.getElementById("ai-typing");

    if (typing) {
        typing.remove();
    }
}

/* =========================================================
   SEND MESSAGE TO GROQ API
========================================================= */

async function sendAIMessage(message) {

    if (!message) return;

    if (chatbot.isLoading) return;

    chatbot.isLoading = true;

    addMessage("user", message);

    chatbot.messages.push({
        role: "user",
        content: message
    });

    showTyping();

    try {

        const response =
            await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: message,

                    history:
                        chatbot.messages.slice(-8)

                })

            });


        const data =
            await response.json();


        hideTyping();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "AI request failed"
            );

        }


        if (!data.answer) {

            throw new Error(
                "AI returned an empty response"
            );

        }


        addMessage(
            "assistant",
            data.answer,
            data.actions || []
        );


        chatbot.messages.push({

            role: "assistant",

            content: data.answer

        });


    } catch (error) {

        hideTyping();

        console.error(
            "Priyanshu AI Error:",
            error
        );


        addMessage(
            "assistant",
            "I'm having trouble connecting right now. Please try again in a moment."
        );


    } finally {

        chatbot.isLoading = false;

    }
}


/* =========================================================
   QUICK QUESTION
========================================================= */

/*
   IMPORTANT:
   This function is GLOBAL.

   Your HTML buttons can directly call:
   sendQuickQuestion("...")
*/

function sendQuickQuestion(question) {

    console.log(
        "Quick question:",
        question
    );

    if (!question) return;


    /* Open chatbot */

    openChatbot();


    /* Send question */

    sendAIMessage(question);
}


/* =========================================================
   SUBMIT TEXT MESSAGE
========================================================= */

function submitAIMessage() {

    const input =
        document.getElementById(
            "ai-chat-input"
        );

    if (!input) return;


    const message =
        input.value.trim();


    if (!message) return;


    input.value = "";


    sendAIMessage(message);
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* -----------------------------------------
           ENTER KEY
        ----------------------------------------- */

        const input =
            document.getElementById(
                "ai-chat-input"
            );


        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        submitAIMessage();

                    }

                }
            );

        }


        /* -----------------------------------------
           AI POPUP NOTIFICATION
        ----------------------------------------- */

        setTimeout(
            function () {

                const notification =
                    document.getElementById(
                        "ai-chat-notification"
                    );


                if (
                    notification &&
                    !chatbot.isOpen
                ) {

                    notification.classList.remove(
                        "hide"
                    );


                    /*
                       Automatically close
                       after 4 seconds
                    */

                    setTimeout(
                        function () {

                            if (
                                !chatbot.isOpen
                            ) {

                                hideChatNotification();

                            }

                        },
                        4000
                    );

                }

            },
            1200
        );

    }
);