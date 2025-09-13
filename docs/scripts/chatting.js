// PORT 3000 : 채팅 앱

// 변수 지정
let my_light = false;
let now_group = "";
let my_id = "";
let chat_method = 0;
let make_group_chat_div = document.querySelector(".make_group_chat");
let chatting_div = document.querySelector(".chatting");
let mainmenu_div = document.querySelector(".main-menu");
let login_div = document.querySelector(".login");
let edit_profile_div = document.querySelector(".profile-edit");
let aichatting_div = document.querySelector(".AIchatting");
let AIcontainer = document.querySelector(".AIcontainer");
let send_btn = document.querySelector("#send_btn");
let container = document.querySelector(".container");
let textbox = document.querySelector("#textbox");
let partner_id_render = document.querySelector("#partner-id");
let friends_list = document.querySelector(".friends_container");
let back_btn = document.querySelectorAll(".back_main");
let partner_id = "";
const socket = io();
let partner_lang = "";
let aimessages = [];
let IDPWnotcorrect = "아이디 혹은 비밀번호가 일치하지 않습니다.";
let SIGNUPok = "회원가입 성공! 다시 로그인 해주세요.";
let FRIENDok1 = "친구 추가 성공!";
let FRIENDok2 = "상대도 당신에게 친구추가를 하면 친구가 됩니다.";
let GroupChatOK = "관리자에게 요청이 전송되었습니다. 허용 시 참여됩니다.";
let PfOk = "프로필 수정이 완료되었습니다.";
let RefreshToApply = "변경하기 위해 다시 로그인 해주십시오.";
let CheckTranslate = "번역본 보기";
let GroupChatOK2 = "그룹챗 만들기 성공!";

console.log("콘솔 꺼라. 뭐 입력했다가 밴먹을 수 있어");

/**
 * 상대가 보낸 이미지를 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function make_partner_image(base64) {
    container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="partner-chat">
            <img src="${base64}" class="chat-image">
        </div>
    `,
    );
}

/**
 * 그룹챗에서 상대가 보낸 이미지를 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function make_group_partner_image(base64, partner){
    container.insertAdjacentHTML(
        "beforeend",
        `
        <p class="group_partner_name">${partner}</p>
        <div class="partner-chat">
            <img src="${base64}" class="chat-image">
        </div>
    `,
    );
}

/**
 * 내내가 보낸 이미지를 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function make_my_image(base64) {
    container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="my-chat">
            <img src="${base64}" class="chat-image">
        </div>
    `,
    );
}

/**
 * 내가 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function make_my_chat(content) {
    container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="my-chat">
            <p>${content}</p>
        </div>
    `,
    );
}

/**
 * 상대방이 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function make_partner_chat(content) {
    container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="partner-chat">
            <p>${content}</p>
        </div>
    `,
    );
}

/**
 * 내가 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function AImake_my_chat(content) {
    AIcontainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="ai-my-chat">
            <p>${content}</p>
        </div>
    `,
    );
}

/**
 * 상대방이 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function AImake_partner_chat(content) {
    AIcontainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="partner-chat">
            <p>${content}</p>
        </div>
    `,
    );
}

/**
 * 그룹챗에서 상대방이 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content
 */
function make_group_partner_chat(content, partner) {
    container.insertAdjacentHTML(
        "beforeend",
        `
        <p class="group_partner_name">${partner}</p>
        <div class="partner-chat">
            <p>${content}</p>
        </div>
    `,
    );
}

/**
 * 언어가 다를 경우를 대비해서 채팅에 띄울때 번역본도 함께 띄우도록
 * @param {string} content
 */
function make_partner_chat_otherlang(content, partner_lang, partner) {
    // 이름 먼저 추가
    container.insertAdjacentHTML(
        "beforeend",
        `<p class="group_partner_name">${partner}</p>`
    );

    // 채팅 박스 생성
    const div = document.createElement("div");
    div.classList.add("partner-chat");
    div.innerHTML = `
        <p class="content">${content}</p>
        <button class="show_translate">${CheckTranslate}</button>
    `;
    container.appendChild(div);

    


    // 바로 이벤트 붙이기
    const btn = div.querySelector(".show_translate");
    btn.addEventListener("click", async () => {
        let translated = div.querySelector(".translated");
        if (!translated) {
            translated = document.createElement("p");
            translated.classList.add("translated");
            translated.textContent = "번역본을 불러오고 있습니다...";
            div.appendChild(translated);
        } else {
            translated.textContent = "번역본을 새로 불러오고 있습니다...";
        }

        try {
            const result = await translate_text(partner_lang, my_lang, content);
            translated.textContent = result;
            btn.style.display = "none"; // 번역 끝나면 버튼 숨기기
        } catch (err) {
            console.error("번역 오류 발생:", err);
            translated.textContent = "번역본을 불러오지 못했습니다.";
        }
    });

    container.appendChild(div);
}

/**
 * 언어가 다를 경우를 대비해서 채팅에 띄울때 번역본도 함께 띄우도록
 * @param {string} content
 */
function make_group_partner_chat_otherlang(content, partner_lang, partner) {
    // 이름 먼저 추가
    container.insertAdjacentHTML(
        "beforeend",
        `<p class="group_partner_name">${partner}</p>`
    );

    // 채팅 박스 생성
    const div = document.createElement("div");
    div.classList.add("partner-chat");
    div.innerHTML = `
        <p class="content">${content}</p>
        <button class="show_translate">${CheckTranslate}</button>
    `;
    container.appendChild(div);

    

    // 바로 이벤트 붙이기
    const btn = div.querySelector(".show_translate");
    btn.addEventListener("click", async () => {
        let translated = div.querySelector(".translated");
        if (!translated) {
            translated = document.createElement("p");
            translated.classList.add("translated");
            translated.textContent = "번역본을 불러오고 있습니다...";
            div.appendChild(translated);
        } else {
            translated.textContent = "번역본을 새로 불러오고 있습니다...";
        }

        try {
            const result = await translate_text(partner_lang, my_lang, content);
            translated.textContent = result;
            btn.style.display = "none"; // 번역 끝나면 버튼 숨기기
        } catch (err) {
            console.error("번역 오류 발생:", err);
            translated.textContent = "번역본을 불러오지 못했습니다.";
        }
    });

    container.appendChild(div);
}

send_btn.addEventListener("click", async () => {
    let param = {};
    if (textbox.value) {
        make_my_chat(textbox.value);
    }
    if (chat_method === 1) {
        param = {
            from: my_id,
            to: now_group,
            content: textbox.value,
            mehtod: 1,
            my_lang: my_lang
        };
    } else {
        param = {
            from: my_id,
            to: partner_id,
            content: textbox.value,
            method: 0
        };
    }
    socket.emit("chatting", param);
    textbox.value = "";
    container.scrollTop = container.scrollHeight;
});

const uploadBtn = document.querySelector("#upload-btn");
const imageUpload = document.querySelector("#image-upload");

uploadBtn.addEventListener("click", () => {
    imageUpload.click(); // 버튼 누르면 input 클릭됨
});

imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64 = e.target.result; // ex: data:image/png;base64,...
        const fullContent = `#image/${base64}`;

        // 내 채팅창에 표시
        make_my_image(base64);

        // 서버에 전송
        const param = {
            from: my_id,
            to: partner_id,
            content: fullContent,
        };
        socket.emit("chatting", param);
    };
    reader.readAsDataURL(file);
});

// @deprecated
// partner_id_render.addEventListener('click',()=>{
//     partner_id = prompt('ID를 입력해주세요:');
//     partner_id_render.textContent = partner_id;
// });

textbox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // 폼 제출 방지
        send_btn.click(); // 버튼 클릭 이벤트 실행
    }
});

// AI 텍스트박스에서도 Enter 키로 전송
document.querySelector('#AItextbox').addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // 폼 제출 방지
        document.querySelector('#AIsend_btn').click(); // AI 전송 버튼 클릭 이벤트 실행
    }
});

//enter_groupchat_room(groupId);
/**
 * 채팅방 입장하는 함수
 * @param {string} partner
 */
async function enter_chat_room(partner) {
    partner_id = partner;
    chatting_div.style.display = "flex";
    mainmenu_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    chatting_div.querySelector(".back_main").style.display = "flex";
    container.innerHTML = "";

    // ✅ 먼저 partner_lang 세팅
    const data = await get_chattings(my_id, partner);
    partner_lang = data.partnerLanguage;
    console.log(my_lang, partner_lang, my_lang !== partner_lang);

    // ✅ 이제 확실히 partner_lang이 세팅된 후에 채팅 기록 로드
    data.chattings.forEach((ele) => {
        if (isImageContent(ele.content)) {
            const base64 = extractBase64(ele.content);
            if (ele.id === my_id) {
                make_my_image(base64);
            } else {
                make_partner_image(base64);
            }
        } else {
            if (ele.id === my_id) {
                make_my_chat(ele.content);
            } else {
                if (partner_lang && my_lang !== partner_lang) {
                    make_partner_chat_otherlang(ele.content, partner_lang, partner);
                } else {
                    make_partner_chat(ele.content);
                }
            }
        }
    });

    partner_id_render.textContent = partner;
    container.scrollTop = container.scrollHeight;
    chat_method = 0;
}

async function enter_groupchat_room(groupId) {
    chatting_div.style.display = "flex";
    mainmenu_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    chatting_div.querySelector(".back_main").style.display = "flex";
    container.innerHTML = "";
    now_group = groupId

    // ✅ 그룹 채팅 정보 요청
    const data = await get_groupchat_history(groupId);
    if (data.message !== "2") {
        alert("그룹 채팅방을 불러오지 못했습니다.");
        return;
    }

    const { chattings, members, title } = data;

    // ✅ 그룹 타이틀을 partner-id에 설정
    console.log("그룹 타이틀:", title); // 디버깅용
    console.log("partner_id_render:", partner_id_render); // 디버깅용
    
    if (partner_id_render) {
        partner_id_render.textContent = title || "그룹채팅";
        console.log("partner-id 설정됨:", partner_id_render.textContent); // 디버깅용
        
        // 강제로 다시 설정 (다른 코드가 덮어쓸 수 있음)
        setTimeout(() => {
            partner_id_render.textContent = title || "그룹채팅";
            console.log("setTimeout으로 다시 설정:", partner_id_render.textContent);
        }, 100);
    } else {
        console.error("partner_id_render를 찾을 수 없습니다!");
    }

    // ✅ 멤버별 언어 정보 정리
    const langMap = {};
    members.forEach((member) => {
        langMap[member.id] = member.lang || "unknown";
    });

    console.log(chattings);
    if (chattings) {
    // ✅ 채팅 렌더링
        chattings.forEach((ele) => {
            const senderId = ele.id;
            const content = ele.content;
            const lang = langMap[senderId];

            if (isImageContent(content)) {
                const base64 = extractBase64(content);
                if (senderId === my_id) {
                    make_my_image(base64);
                } else {
                    make_group_partner_image(base64, senderId);
                }
            } else {
                if (senderId === my_id) {
                    make_my_chat(content);
                } else {
                    if (lang && my_lang !== lang) {
                        make_group_partner_chat_otherlang(content, lang, senderId);
                    } else {
                        make_group_partner_chat(content, senderId);
                    }
                }
            }
        });
    }

    // ✅ UI 요소 업데이트
    partner_id_render.textContent = `[그룹채팅]`;
    container.scrollTop = container.scrollHeight;

    chat_method = 1;
    console.log(chat_method);
}

/**
 * 친구 목록 띄워주는 함수
 */
async function display_friendlist() {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "flex";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    mainmenu_div.querySelector(".back_main").style.display = "none";
    friends_list.innerHTML = "";

    const data = await get_friends(my_id);
    if (data.message !== "2") {
        alert("친구 목록을 불러오지 못했습니다.");
        return;
    }

    const friends = data.friends;
    friends.forEach((friend) => {
        console.log(friend);
        const profileSrc =
            friend.pf === "Default" || friend.pf === ""
                ? "./imgs/default_pfp.png"
                : friend.pf;

        let translateBtnHtml = "";
        if (friend.lang && friend.lang !== my_lang) {
            translateBtnHtml = `
                <button class="translate-desc-btn" data-lang="${friend.lang}" data-desc="${friend.desc}">
                    <img src="./svgs/translate_desc.svg" alt="번역" class="translate-icon">
                </button>
            `;
        }

        friends_list.insertAdjacentHTML(
            "beforeend",
            `
            <div class="user-table" data-id="${friend.id}">
                <img src="${profileSrc}" class="user-icon">
                <div class="user-info">
                    <strong class="user-name">${friend.id}</strong>
                    <p class="user-description">${friend.desc}</p>
                </div>
                ${translateBtnHtml}
                <button class="delete-friend-btn" data-id="${friend.id}">
                    <img src="./svgs/delete_friend.svg" alt="삭제" class="delete-icon">
                </button>
            </div>
        `,
        );
    });

    // ✅ 채팅방 입장 이벤트
    document.querySelectorAll(".user-info").forEach((ele) => {
        ele.addEventListener("click", () => {
            enter_chat_room(ele.closest(".user-table").dataset.id);
        });
    });

    // ✅ 친구 삭제 이벤트 (여기서 새로 바인딩)
    document.querySelectorAll(".delete-friend-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // 채팅방 입장 이벤트 막기
            const friendId = btn.dataset.id;
            if (confirm(`${friendId}님을 친구목록에서 삭제할까요?`)) {
                remove_friend(my_id, friendId).then((data) => {
                    if (data.message === "2") {
                        alert("친구가 삭제되었습니다.");
                        display_friendlist(); // 새로고침
                    } else if (data.message === "-2") {
                        alert("이미 친구목록에 없습니다.");
                    } else {
                        alert("삭제 중 오류가 발생했습니다.");
                    }
                });
            }
        });
    });

    // ✅ 친구 상태메시지 번역 버튼
    document.querySelectorAll(".translate-desc-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation(); // 채팅방 안 열리게 방지

            const friendLang = btn.dataset.lang;
            const friendDesc = btn.dataset.desc;

            const parent = btn.closest(".user-table");
            let translated = parent.querySelector(".translated-desc");

            if (!translated) {
                translated = document.createElement("p");
                translated.classList.add("translated-desc");
                translated.textContent = "번역 중입니다...";
                parent.querySelector(".user-info").appendChild(translated);
            } else {
                translated.textContent = "번역 새로고침 중...";
            }

            try {
                const result = await translate_text(
                    friendLang,
                    my_lang,
                    friendDesc,
                );
                translated.textContent = result;
                btn.style.display = "none"; // 번역 끝나면 버튼 숨김
            } catch (err) {
                console.error("상태메시지 번역 오류:", err);
                translated.textContent = "번역 실패!";
            }
        });
    });
    // 이미 Nova AI 항목이 있으면 추가하지 않음
    if (!document.querySelector(".EnterAIChat")) {
        friends_list.insertAdjacentHTML(
            "beforebegin",
            `
            <div class="user-table EnterAIChat" data-id="NovaAI">
                <img src="../imgs/default_pfp.png" class="user-icon">
                <div class="user-info">
                    <strong class="user-name">Nova AI</strong>
                    <p class="user-description">새로운 AI 친구, Nova를 만나보세요.</p>
                </div>
            </div>
            `
        );
    }

    // ✅ 채팅방 입장 이벤트
    document.querySelectorAll(".EnterAIChat").forEach((ele) => {
        ele.addEventListener("click", () => {
            enter_ai_chat_room();
        });
    });
}
document.querySelector('#AIsend_btn').addEventListener('click', async () => {
    const userMessage = document.querySelector('#AItextbox').value;
    if (!userMessage.trim()) return;

    // 입력창 초기화
    document.querySelector('#AItextbox').value = "";

    document.querySelector('#AIsend_btn').disabled = true;
    
    // 사용자 메시지를 화면에 표시
    AImake_my_chat(userMessage);
    
    // aimessages에 사용자 메시지 추가
    aimessages.push({ role: "user", content: userMessage });
    
    // AI 응답 요청
    try {
        const aiResponse = await nova_response(aimessages);
        
        // AI 응답을 화면에 표시
        AImake_partner_chat(aiResponse);
        
        // aimessages에 AI 응답 추가
        aimessages.push({ role: "assistant", content: aiResponse });
        
        
        // 서버에 업데이트된 히스토리 저장
        await update_ainova_history(my_id, aimessages);
        
    } catch (error) {
        console.error("AI 응답 오류:", error);
        AImake_partner_chat("죄송합니다. AI 응답을 받아오는 중 오류가 발생했습니다.");
    }
    
    // 스크롤을 맨 아래로
    AIcontainer.scrollTop = AIcontainer.scrollHeight;
    document.querySelector('#AIsend_btn').disabled = false;
});

/**
 * AI 채팅방 입장하는 함수
 */
async function enter_ai_chat_room() {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "flex";
    
    // AI 채팅 히스토리 불러오기
    const data = await get_ainova_history(my_id);
    if (data.message !== "2") {
        console.error("AI 히스토리를 불러오지 못했습니다.");
        return;
    }
    
    aimessages = data.ainovaHistory || [];
    
    // AI 채팅 컨테이너 초기화
    AIcontainer.innerHTML = "";
    
    // AI 메시지들을 분류해서 채팅으로 표시
    aimessages.forEach((message) => {
        if (message.role === "user") {
            // 사용자 메시지는 오른쪽에 표시
            AImake_my_chat(message.content);
        } else if (message.role === "assistant") {
            // AI 메시지는 왼쪽에 표시
            AImake_partner_chat(message.content);
        }
    });
    
    // 스크롤을 맨 아래로
    AIcontainer.scrollTop = AIcontainer.scrollHeight;
}

let groups_container = document.querySelector('.groups_container');
/**
 * 그룹 목록 띄워주는 함수
 */
async function display_grouplist() {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "flex";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    mainmenu_div.querySelector(".back_main").style.display = "none";
    groups_container.innerHTML = "";

    const data = await get_groups(my_id);
    if (data.message !== "2") {
        alert("그룹 목록을 불러오지 못했습니다.");
        return;
    }

    const groups = data.groups;
    groups.forEach((group) => {
        console.log(group);

        // 이 부분은 도윤이가 꾸며줄거니까 비워놓음!
        groups_container.insertAdjacentHTML(
            "beforeend",
            `
            <div class="grouptable" data-id="${group.groupId}">
                <div class="group_info">
                    <strong class="group_name">${group.name}</strong>
                    <p class="group_id">${group.groupId}</strong>
                </div>
                <button class="delete-group-btn" data-id="${group.groupId}">
                    <img src="./svgs/delete_group.svg" alt="삭제" class="delete-icon">
                </button>
            </div>
            `
        );
    });

    // ✅ 그룹채팅방 입장 이벤트
    document.querySelectorAll(".group_info").forEach((ele) => {
        ele.addEventListener("click", () => {
            const groupId = ele.closest(".grouptable").dataset.id;
            enter_groupchat_room(groupId);
        });
    });

    // ✅ 그룹 나가기 이벤트 (여기서 새로 바인딩)
    document.querySelectorAll(".delete-group-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // 채팅방 입장 이벤트 막기
            const groupId = btn.dataset.id;
            if (confirm("이 그룹에서 나가시겠습니까?")) {
                leave_groupchat(groupId, my_id).then((data) => {
                    if (data.message === "1") {
                        alert("그룹에서 나갔습니다.");
                        display_grouplist(); // 새로고침
                    } else if (data.message === "-1") {
                        alert("그룹을 찾을 수 없습니다.");
                    } else {
                        alert("그룹 나가기 중 오류가 발생했습니다.");
                    }
                });
            }
        });
    });
}


function isImageContent(content) {
    return content.startsWith("#image/");
}

function extractBase64(content) {
    return content.replace("#image/", "");
}

socket.on("chatting", (data) => {
    if (data.from !== my_id) {
        if (data.to === my_id && data.from === partner_id) {
            if (isImageContent(data.content)) {
                const base64 = extractBase64(data.content);
                make_partner_image(base64); // 이 함수는 <img> 태그 만들어서 화면에 추가하는 거임
            } else {
                if (my_lang !== partner_lang) {
                    make_partner_chat_otherlang(data.content, partner_lang);
                } else {
                    make_partner_chat(data.content);
                }
            }
            container.scrollTop = container.scrollHeight;
        } else if (data.to === now_group) {
            if (isImageContent(data.content)) {
                const base64 = extractBase64(data.content);
                make_partner_image(base64); // 이 함수는 <img> 태그 만들어서 화면에 추가하는 거임
            } else {
                if (my_lang !== data.my_lang) {
                    make_group_partner_chat_otherlang(data.content, partner_lang, data.from);
                } else {
                    make_group_partner_chat(data.content,data.from);
                }
            }
        }
    }
});

// 여기서 부터 로그인 받아옴
make_group_chat_div.style.display = "none";
chatting_div.style.display = "none";
mainmenu_div.style.display = "none";
login_div.style.display = "flex";
aichatting_div.style.display = "none";

let input_id = document.querySelector("#input-id");
let input_pw = document.querySelector("#input-pw");
let input_login = document.querySelector("#input-login");
let input_register = document.querySelector("#input-register");
let input_add_friend = document.querySelector("#input-add-friend");
let input_add_friend_btn = document.querySelector("#input-add-friend-btn");
let my_desc = "";
let my_lang = "kr"; // default value

function display_ban(reason) {
    mainmenu_div.style.display = "none";
    aichatting_div.style.display = "none";
    document.querySelector("#banned-div").style.display = "flex";
    document.querySelector("#ban_reason").textContent = reason;
}

/**
 * UI를 영어로 바꾸는 함수!!
 */
function changeui_en() {
    // 시스템 메시지
    IDPWnotcorrect = "The ID or password is incorrect.";
    SIGNUPok = "Sign up successful! Please log in again.";
    FRIENDok1 = "Friend added successfully!";
    FRIENDok2 = "Your friend also needs to add you to become friends.";
    PfOk = "Profile updated successfully.";
    RefreshToApply = "Please log in again to apply the changes.";
    CheckTranslate = "View Translation";
    GroupChatOK = "Request sent to admin. You'll join once approved.";
    GroupChatOK2 = "Group chat created successfully!";

    // [1] 제목들
    document.querySelectorAll("#app-title").forEach((el) => {
        if (el.textContent === "로그인") el.textContent = "Login";
        if (el.textContent === "서비스 이용 불가 안내")
            el.textContent = "Service Access Restricted";
        if (el.textContent === "그룹챗 만들기")
            el.textContent = "Create Group Chat";
        if (el.textContent === "MN Chat") el.textContent = "MN Chat";
    });

    // [2] 로그인 페이지
    const loginWelcome = document.querySelector(".login strong");
    if (loginWelcome) loginWelcome.textContent = "Welcome to the Chat App.";

    document.querySelector("#input-id").placeholder = "Enter your ID";
    document.querySelector("#input-pw").placeholder = "Enter your password";
    document.querySelector("#input-login").textContent = "Login";
    document.querySelector(".login-form p").textContent = "Don't have an account?";
    document.querySelector("#input-register").textContent = "Sign Up";

    // [3] 밴 화면
    document.querySelector(".banned-div strong").textContent = "You are banned.";
    document.querySelector(".banned-div p").textContent =
        "According to the Information and Communications Network Act, you have been banned for inappropriate language or fraudulent activity.";
    document.querySelector("#ban_reason").textContent = "Loading...";

    // [4] 메인 메뉴
    const mainLabels = document.querySelectorAll(".main-menu strong");
    if (mainLabels.length > 0) {
        mainLabels[0].textContent = "My Profile";
        mainLabels[1].textContent = "Friends";
        mainLabels[2].textContent = "Group Chats";
        mainLabels[3].textContent = "Add Friend";
        mainLabels[4].textContent = "Add Group Chat";
    }

    document.querySelector("#input-add-friend").placeholder = "Enter friend ID";
    document.querySelector("#input-add-friend-btn").textContent = "Add Friend";
    document.querySelector("#input-add-group").placeholder = "Enter group chat ID";
    document.querySelector("#input-add-group-btn").textContent = "Add Group Chat";
    document.querySelector("#make_group_chat").textContent = "Create Group Chat";

    // [5] 프로필 수정 화면
    document.querySelector(".profile-edit strong").textContent = "Edit Profile";
    const profileStrong = document.querySelectorAll(".profile-edit .user-info strong");
    if (profileStrong.length >= 2) {
        profileStrong[0].textContent = "Edit Status Message";
        profileStrong[1].textContent = "Change Language";
    }

    document.querySelector("#edit_profile_message").placeholder = "Enter your status message here";

    const countrySelect = document.querySelector("#countrys");
    countrySelect.querySelector('option[value="kr"]').textContent = "Korean";
    countrySelect.querySelector('option[value="en"]').textContent = "English";

    document.querySelector("#apply_profile_edit").textContent = "Apply";

    // [6] 그룹챗 만들기
    document.querySelector(".make_group_chat strong").textContent = "Create Group Chat";
    document.querySelector("#input-make-group-chat").placeholder = "Enter group chat name";
    document.querySelector("#apply_make_group_chat").textContent = "Create";

    // [7] 채팅창
    const partnerId = document.querySelector("#partner-id");
    if (partnerId && partnerId.textContent.includes("로딩중"))
        partnerId.textContent = "Loading...";

    document.querySelector("#textbox").placeholder = "Type your message here.";

}

input_login.addEventListener("click", async () => {
    if (input_id.value && input_pw.value) {
        await try_login(input_id.value, input_pw.value).then(async (data) => {
            if (data.data.message === "2") {
                await ban_check(my_id).then((data2) => {
                    if (data2.message === "1") {
                        // 여기서 밴 화면 띄우기
                    } else {
                        //문제 없음ㅋ
                        input_login.disabled = true;
                        my_id = data.id;
                        console.log(data.data);
                        document.querySelector("#my_name").textContent = my_id;
                        document.querySelector("#my_desc").textContent =
                            data.data.desc;

                        if (data.data.pf !== "Default" && data.data.pf !== "") {
                            document.querySelector("#my_pf").src = data.data.pf;
                            document.querySelector("#preview_profile_img").src =
                                data.data.pf;
                        } else {
                            document.querySelector("#my_pf").src =
                                "./imgs/default_pfp.png";
                            document.querySelector("#preview_profile_img").src =
                                "./imgs/default_pfp.png";
                        }



                        document.querySelector("#edit_profile_message").value =
                            data.data.desc;
                        my_desc = data.data.desc;
                        my_pf = data.data.pf;
                        my_lang = data.data.lang;
                        my_light = data.data.light;
                        if (data.data.light) {
                            document.body.classList.add('light-mode');
                        }
                        if (my_lang == "en") {
                            changeui_en();
                        }
                        console.log(my_id);
                        display_friendlist();
                        display_grouplist();
                        document.querySelector(".my_frofile").addEventListener('click',()=>{
                            display_edit_profile();
                        })
                    }
                });
            } else {
                alert(IDPWnotcorrect);
            }
        });
    }
});

input_register.addEventListener("click", () => {
    if (input_id.value && input_pw.value) {
        try_register(input_id.value, input_pw.value).then((data) => {
            console.log(data);
            if (data.data.message === "1") {
                alert(SIGNUPok);
            }
        });
    }
});

input_add_friend_btn.addEventListener("click", () => {
    if (input_add_friend.value) {
        add_friend(my_id, input_add_friend.value).then((data) => {
            if (data.message === "2") {
                alert(FRIENDok1);
                alert(FRIENDok2);
                display_friendlist();
            }
        });
    }
});

function display_edit_profile() {
    chatting_div.style.display = "none";
    mainmenu_div.style.display = "none";
    login_div.style.display = "none";
    edit_profile_div.style.display = "flex";
    aichatting_div.style.display = "none";
}

//data.message
//edit_profile(id, mes);

let selectedProfileBase64 = "";
let input_editing_desc = document.querySelector("#edit_profile_message");
let apply_editing_desc = document.querySelector("#apply_profile_edit");
let profileImageInput = document.querySelector("#edit_profile_image");
let previewProfileImg = document.querySelector("#preview_profile_img");
let language_select = document.querySelector("#countrys");
//my_lang
language_select.value = my_lang;

profileImageInput.addEventListener("change", () => {
    const file = profileImageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedProfileBase64 = e.target.result; // base64 데이터
        previewProfileImg.src = selectedProfileBase64; // 미리보기 반영
    };
    reader.readAsDataURL(file);
});

console.log(apply_editing_desc);

apply_editing_desc.addEventListener("click", async () => {
    if (
        input_editing_desc.value !== my_desc ||
        selectedProfileBase64 !== "" ||
        language_select.value !== my_lang ||
        lightModeToggle.checked !== my_light
    ) {
        console.log("OK!");
        edit_profile(
            my_id,
            input_editing_desc.value,
            selectedProfileBase64,
            language_select.value,
            lightModeToggle.checked
        ).then((data) => {
            console.log(data);
            if (data.message === "1") {
                alert(PfOk);
                alert(RefreshToApply);
                location.reload();
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
                console.error("Front Error.");
                display_friendlist();
            }
        });
    }
});


let lightModeToggle = document.querySelector("#light-mode-toggle"); // 하이픈(-)으로!

// 기존 라이트모드 상태 초기 반영 (불러온 값 기준)
lightModeToggle.checked = my_light;
if (my_light) document.body.classList.add("light-mode");

// 토글 시 화면에만 적용 (서버 저장은 '수정' 버튼 누를 때!)
lightModeToggle.addEventListener("change", () => {
    if (lightModeToggle.checked) {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }
});


let apply_make_group_chat = document.querySelector("#apply_make_group_chat");
let input_make_group_chat = document.querySelector("#input-make-group-chat");
let make_group_chat = document.querySelector("#make_group_chat");
let input_add_group_btn = document.querySelector("#input-add-group-btn");
let input_add_group = document.querySelector("#input-add-group");

input_add_group_btn.addEventListener('click', ()=>{
    if (input_add_group.value) {
        join_groupchat(input_add_group.value, my_id).then((data) => {
            if (data.message === "1") {
                alert("그룹챗에 참여했습니다.");
                display_grouplist();
            } else {
                alert("오류가 발생하여 그룹챗에 참여하지 못했습니다.");
            }
        });
    }
});

// 그룹챗 제작 화면
function display_making_group() {
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "none";
    login_div.style.display = "none";
    make_group_chat_div.style.display = "flex";
    aichatting_div.style.display = "none";
    make_group_chat_div.querySelector(".back_main").style.display = "flex";
}

apply_make_group_chat.addEventListener("click", () => {
    if (input_make_group_chat.value) {
        create_groupchat({ title: input_make_group_chat.value, maker: my_id }).then((data) => {
            if (data.message === "1") {
                alert(GroupChatOK2);
                alert("그룹챗 아이디는 "+data.groupId+"입니다.");
                display_grouplist();
            }
        });
    }
});

make_group_chat.addEventListener("click", () => {
    display_making_group();
});

// 뒤로가기 이벤트 생성^^
back_btn.forEach((ele) => {
    // 기존 이벤트 리스너 제거 후 새로 등록
    ele.removeEventListener("click", handleBackClick);
    ele.addEventListener("click", handleBackClick);
});

function handleBackClick() {
    display_friendlist();
    display_grouplist();
}

//AI
