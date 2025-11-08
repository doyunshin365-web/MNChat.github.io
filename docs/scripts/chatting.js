// PORT 3000 : 채팅 앱


// 변수 지정
let my_light = false;
let now_group = "";
let my_id = "";
let chat_method = 0;
let make_group_chat_div = document.querySelector(".make_group_chat");
let chatting_div = document.querySelector(".chatting");
let mainmenu_div = document.querySelector(".main-menu");
let mainmenu_navigation_div = document.querySelector(".main-menu-navigation");
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
let developVoiceContent_div = document.querySelector(".developVoiceContent");
let developVoice_div = document.querySelector(".developVoice");
let userVoice_div = document.querySelector(".user_voice");
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

// 추가 alert 메시지 변수들
let GroupChatLoadError = "그룹 채팅방을 불러오지 못했습니다.";
let FriendListLoadError = "친구 목록을 불러오지 못했습니다.";
let FriendDeleted = "친구가 삭제되었습니다.";
let FriendNotInList = "이미 친구목록에 없습니다.";
let FriendDeleteError = "삭제 중 오류가 발생했습니다.";
let GroupListLoadError = "그룹 목록을 불러오지 못했습니다.";
let GroupLeft = "그룹에서 나갔습니다.";
let GroupNotFound = "그룹을 찾을 수 없습니다.";
let GroupLeaveError = "그룹 나가기 중 오류가 발생했습니다.";
let UnknownError = "알 수 없는 오류가 발생했습니다.";
let GroupJoined = "그룹챗에 참여했습니다.";
let GroupJoinError = "오류가 발생하여 그룹챗에 참여하지 못했습니다.";
let FeatureNotReady = "해당 기능은 아직 완성되지 않았습니다.";
let CheckNotPrank = "장난글이 아니라는 체크를 해주세요!";
let FillEmailContent = "이메일과 내용을 모두 입력해주세요.";
let ContactSuccess = "문의가 성공적으로 접수되었습니다! ✉️";
let ContactFailed = "문의 전송에 실패했습니다. 다시 시도해주세요. ⚠️";

// 번역 관련 메시지 변수들
let Translating = "번역본을 불러오고 있습니다...";
let Retranslating = "번역본을 새로 불러오고 있습니다...";
let TranslationFailed = "번역본을 불러오지 못했습니다.";

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
function make_partner_chat_otherlang(content, partner_lang, partner, foreign_ver) {

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
            translated.textContent = Translating;
            div.appendChild(translated);
        } else {
            translated.textContent = Retranslating;
        }

        try {
            let result = '';
            if (foreign_ver) {
                result = foreign_ver; // 이미 번역본을 제공해줬음
            } else {
                result = await translate_text(partner_lang, my_lang, content, "."); // 제공이 안되어있음
            }
            translated.textContent = result;
            btn.style.display = "none"; // 번역 끝나면 버튼 숨기기
        } catch (err) {
            console.error("번역 오류 발생:", err);
            translated.textContent = TranslationFailed;
        }
    });

    container.appendChild(div);
}

/**
 * 언어가 다를 경우를 대비해서 채팅에 띄울때 번역본도 함께 띄우도록
 * @param {string} content
 */
function make_group_partner_chat_otherlang(content, partner_lang, partner, foreign_ver) {
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
            translated.textContent = Translating;
            div.appendChild(translated);
        } else {
            translated.textContent = Retranslating;
        }

        try {
            let result = '';
            if (foreign_ver) {
                result = foreign_ver; // 이미 번역본을 제공해줬음
            } else {
                result = await translate_text(partner_lang, my_lang, content, "."); // 제공이 안되어있음
            }
            translated.textContent = result;
            btn.style.display = "none"; // 번역 끝나면 버튼 숨기기
        } catch (err) {
            console.error("번역 오류 발생:", err);
            translated.textContent = TranslationFailed;
        }
    });

    container.appendChild(div);
}

async function waitForConfirm() {
    const popup = document.querySelector(".previewtranslate");
    const confirmBtn = document.getElementById("confirm_translate");
    const reloadBtn = document.getElementById("reload_translate");
    const result_translation = document.querySelector('#translation_result');
  
    async function doTranslate() {
      const translated = await translate_text(my_lang, partner_lang, textbox.value, ".");
      if ('value' in result_translation) {
        result_translation.value = translated;
      } else {
        result_translation.textContent = translated;
      }
    }
  
    await doTranslate(); // 첫 번역 실행
    popup.style.display = "block";
  
    return new Promise((resolve) => {
      async function handleConfirm() {
        popup.style.display = "none";
        cleanup();
        resolve();
      }
  
      async function handleReload() {
        await doTranslate(); // 번역 다시 실행
      }
  
      function cleanup() {
        confirmBtn.removeEventListener("click", handleConfirm);
        reloadBtn.removeEventListener("click", handleReload);
      }
  
      confirmBtn.addEventListener("click", handleConfirm);
      reloadBtn.addEventListener("click", handleReload);
    });
  }
  
  

send_btn.addEventListener("click", async () => {
    let param = {};
    let foreign_ver = '';
    let translation_prompt = document.querySelector('#translation_prompt').value;
    if (textbox.value) {
        if (my_lang !== partner_lang) {
            if (my_TP) {
                await waitForConfirm();
            } else {
                await translate_text(my_lang, partner_lang, textbox.value, translation_prompt);
            }
            foreign_ver = document.querySelector('#translation_result').value;
            make_my_chat(textbox.value);
        } else {
            make_my_chat(textbox.value);
        }
    }
    if (chat_method === 1) {
        param = {
            from: my_id,
            to: now_group,
            content: textbox.value,
            mehtod: 1,
            my_lang: my_lang,
            foreign_ver: foreign_ver
        };
    } else {
        param = {
            from: my_id,
            to: partner_id,
            content: textbox.value,
            method: 0,
            foreign_ver: foreign_ver
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
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    chatting_div.querySelector(".back_main").style.display = "flex";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    userVoice_div.style.display = 'none';
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
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    chatting_div.querySelector(".back_main").style.display = "flex";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    userVoice_div.style.display = 'none';
    container.innerHTML = "";
    now_group = groupId

    // ✅ 그룹 채팅 정보 요청
    const data = await get_groupchat_history(groupId);
    if (data.message !== "2") {
        alert(GroupChatLoadError);
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

async function display_uservoice() {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "none";
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    developVoice_div.style.display = "none";
    userVoice_div.style.display = 'flex';
    developVoiceContent_div.style.display = "none";
    userVoice_div.querySelector('textarea').value = '';
    userVoice_div.querySelector('input').value = '';
}

async function display_developervoice() {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "none";
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    developVoice_div.style.display = "flex";
    userVoice_div.style.display = 'none';
    developVoiceContent_div.style.display = "none";

    const container = document.querySelector(".contentContainer");
    container.innerHTML = ""; // 기존 내용 초기화

    const articles = await get_all_articles_meta();

    // 최신순 정렬 (date 내림차순)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const article of articles) {
        // div 생성
        const articleDiv = document.createElement("div");
        articleDiv.className = article.important ? "importantArticle" : "Article";
        articleDiv.style.display = "flex";

        // 아이콘
        const img = document.createElement("img");
        img.src = "../svgs/bell.svg";
        img.className = article.important ? "bell-icon" : "bell-icon-default";

        // 내용을 담을 div 생성
        const contentDiv = document.createElement("div");
        contentDiv.style.display = "block";

        // 타이틀
        const strong = document.createElement("strong");
        strong.textContent = article.title;
        strong.dataset.contentid = article.id;
        
        // 사용자 언어가 한국어가 아닌 경우 제목 번역
        if (my_lang !== "kr") {
            try {
                const translatedTitle = await translate_text("kr", my_lang, article.title);
                strong.textContent = translatedTitle;
            } catch (error) {
                console.error("제목 번역 오류:", error);
                // 번역 실패 시 원본 제목 유지
            }
        }

        // 날짜
        const p = document.createElement("p");
        const date = new Date(article.date);
        p.textContent = date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        // 이벤트 추가 (누르면 전체 내용 보여줌)
        strong.addEventListener("click", () => {
            display_developervoice_content(article.id);
        });

        // 내용 div에 제목과 날짜 추가
        contentDiv.appendChild(strong);
        contentDiv.appendChild(p);

        // 메인 div에 아이콘과 내용 div 추가
        articleDiv.appendChild(img);
        articleDiv.appendChild(contentDiv);
        
        // 컨테이너에 추가
        container.appendChild(articleDiv);
        
        // 각 항목 사이에 br 추가
        const br = document.createElement("br");
        container.appendChild(br);
    }
}

document.querySelector(".back_developvoice").addEventListener('click', ()=>{
    display_developervoice();
});

async function display_developervoice_content(id) {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "none";
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    userVoice_div.style.display = 'none';
    developVoice_div.style.display = "none";
    developVoiceContent_div.style.display = "flex";
    // API 호출
    const article = await get_article_content(id);

    // 요소 찾기
    const acontainer = document.querySelector(".voicecontent");
    const titleEl = acontainer.querySelector("strong");
    const contentEl = acontainer.querySelector("p");
    
    // 사용자 언어가 한국어가 아닌 경우 내용 번역
    let displayTitle = article.title;
    let displayContent = article.content;
    
    if (my_lang !== "kr") {
        try {
            // 제목과 내용을 번역
            const translatedTitle = await translate_text("kr", my_lang, article.title);
            const translatedContent = await translate_text("kr", my_lang, article.content);
            displayTitle = translatedTitle;
            displayContent = translatedContent;
        } catch (error) {
            console.error("개발자의 소리 번역 오류:", error);
            // 번역 실패 시 원본 내용 유지
        }
    }
    
    // 줄바꿈 처리
    const converted = displayContent
        .replace(/\r\n|\n|\r/g, "<br>")
        .replace(/\\n/g, "<br>");
    
    titleEl.textContent = displayTitle;
    contentEl.innerHTML = converted;
    

}   

/**
 * 친구 목록 띄워주는 함수
 */
async function display_friendlist() {
    make_group_chat_div.style.display = "none";
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "flex";
    mainmenu_navigation_div.style.display = "flex";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    mainmenu_div.querySelector(".back_main").style.display = "none";
    userVoice_div.style.display = 'none';
    friends_list.innerHTML = "";

    const data = await get_friends(my_id);
    if (data.message !== "2") {
        alert(FriendListLoadError);
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
            const parent = ele.closest(".user-table");
            if (parent?.dataset?.id) {
                enter_chat_room(parent.dataset.id);
            } else {
                console.warn("user-table not found for", ele);
            }
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
                        alert(FriendDeleted);
                        display_friendlist(); // 새로고침
                    } else if (data.message === "-2") {
                        alert(FriendNotInList);
                    } else {
                        alert(FriendDeleteError);
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
    
    // Nova AI 프로필이 이미 있는지 확인 후 추가
    const existingNovaAI = document.querySelector(".EnterAIChat");
    if (!existingNovaAI) {
        if (my_lang == "en") {
            friends_list.insertAdjacentHTML(
                "beforebegin",
                `
                <div class="user-table EnterAIChat" data-id="NovaAI">
                    <img src="../imgs/default_pfp.png" class="user-icon">
                    <div class="user-info">
                        <strong class="user-name">Nova AI</strong>
                        <p class="user-description">Meet your AI friend, Nova.</p>
                    </div>
                </div>
            `,
            );
        } else {
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
            `,
            );
        }

    }
    
    // ✅ 채팅방 입장 이벤트 (Nova AI 포함)
    document.querySelectorAll(".EnterAIChat").forEach((ele) => {
        ele.addEventListener("click", () => {
            enter_ai_chat_room();
        });
    });

    const Aritcledata = await get_important_article();
    const container = document.querySelector(".importantArticle");

    if (!container || !Aritcledata) return;

    const titleEl = container.querySelector("strong");
    const contentEl = container.querySelector("p");

    // 사용자 언어가 한국어가 아닌 경우 중요 공지사항 번역
    let displayTitle = Aritcledata.title;
    let displayContent = Aritcledata.contentPreview;
    
    if (my_lang !== "kr") {
        try {
            const translatedTitle = await translate_text("kr", my_lang, Aritcledata.title);
            const translatedContent = await translate_text("kr", my_lang, Aritcledata.contentPreview);
            displayTitle = translatedTitle;
            displayContent = translatedContent;
        } catch (error) {
            console.error("중요 공지사항 번역 오류:", error);
            // 번역 실패 시 원본 내용 유지
        }
    }

    titleEl.textContent = displayTitle;
    titleEl.dataset.contentid = Aritcledata.id;
    contentEl.textContent = displayContent;

    document.querySelector('.importantArticle').addEventListener('click', async ()=>{
        display_developervoice_content(titleEl.dataset.contentid);
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
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    aichatting_div.style.display = "flex";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    userVoice_div.style.display = 'none';
    
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
    mainmenu_navigation_div.style.display = "flex";
    login_div.style.display = "none";
    aichatting_div.style.display = "none";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    mainmenu_div.querySelector(".back_main").style.display = "none";
    groups_container.innerHTML = "";
    userVoice_div.style.display = 'none';

    const data = await get_groups(my_id);
    if (data.message !== "2") {
        alert(GroupListLoadError);
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
                        alert(GroupLeft);
                        display_grouplist(); // 새로고침
                    } else if (data.message === "-1") {
                        alert(GroupNotFound);
                    } else {
                        alert(GroupLeaveError);
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
                    make_partner_chat_otherlang(data.content, partner_lang, data.foreign_ver);
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
                    make_group_partner_chat_otherlang(data.content, partner_lang, data.from, data.foreign_ver);
                } else {
                    make_group_partner_chat(data.content,data.from);
                }
            }
        } else if (data.to === my_id) {
            Notification.requestPermission().then((perm) => {
                if (perm === "granted") {
                  // 2. 알림 띄우기
                  let content = '';
                  if (isImageContent(data.content)) {
                    content = "이미지";
                  } else {
                    content = data.content;
                  }
                  const noti = new Notification(data.from, {
                    body: content,
                    icon: "../imgs/default_pfp.png"
                  });

                  noti.onclick = ()=>{
                    window.focus();
                    enter_chat_room(data.from);
                    noti.close();
                  }
                }
            });
        }
    }
});

// 여기서 부터 로그인 받아옴
make_group_chat_div.style.display = "none";
chatting_div.style.display = "none";
mainmenu_div.style.display = "none";
mainmenu_navigation_div.style.display = "none";
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

// 언어 선택 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.querySelector("#language-select");
    if (languageSelect) {
        languageSelect.addEventListener("change", (e) => {
            const selectedLang = e.target.value;
            if (selectedLang === "en") {
                changeui_en();
            } else if (selectedLang === "kr") {
                changeui_ko();
            }
        });
    }
});

function display_ban(reason) {
    mainmenu_div.style.display = "none";
    mainmenu_navigation_div.style.display = "none";
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
    
    // 추가 alert 메시지 영어 번역
    GroupChatLoadError = "Failed to load group chat room.";
    FriendListLoadError = "Failed to load friend list.";
    FriendDeleted = "Friend has been deleted.";
    FriendNotInList = "Friend is not in the list.";
    FriendDeleteError = "An error occurred while deleting.";
    GroupListLoadError = "Failed to load group list.";
    GroupLeft = "You have left the group.";
    GroupNotFound = "Group not found.";
    GroupLeaveError = "An error occurred while leaving the group.";
    UnknownError = "An unknown error occurred.";
    GroupJoined = "You have joined the group chat.";
    GroupJoinError = "An error occurred while joining the group chat.";
    FeatureNotReady = "This feature is not yet complete.";
    CheckNotPrank = "Please check that this is not a prank message!";
    FillEmailContent = "Please enter both email and content.";
    ContactSuccess = "Your inquiry has been successfully submitted! ✉️";
    ContactFailed = "Failed to send inquiry. Please try again. ⚠️";
    
    // 번역 관련 메시지 영어 번역
    Translating = "Loading translation...";
    Retranslating = "Reloading translation...";
    TranslationFailed = "Failed to load translation.";
    document.querySelector('#translation_prompt').placeholder = "AI will refer to it when translating.";
    
    // 번역 지연 안내 메시지 영어로 변경
    const translationInfo = document.querySelector("#information");
    if (translationInfo) {
        translationInfo.textContent = "If you are using a language other than Korean, posts may appear with a slight delay due to translation.";
    }
  
    // [1] 로그인 페이지
    document.querySelectorAll("#app-title").forEach((el) => {
      if (el.textContent === "로그인") el.textContent = "Login";
      if (el.textContent === "서비스 이용 불가 안내")
        el.textContent = "Service Access Restricted";
      if (el.textContent === "그룹챗 만들기")
        el.textContent = "Create Group Chat";
      if (el.textContent === "MN Chat") el.textContent = "MN Chat";
      if (el.textContent === "유저의 소리📢") el.textContent = "User Feedback 📢";
      if (el.textContent === "개발자의 소리📢") el.textContent = "Developer Notes 📢";
      if (el.textContent === "Nova AI") el.textContent = "Nova AI";
    });
  
    const login = document.querySelector(".login");
    if (login) {
      const strong = login.querySelector("strong");
      if (strong) strong.textContent = "Welcome to the MN Chat!";
      document.querySelector("#input-id").placeholder = "Enter your ID";
      document.querySelector("#input-pw").placeholder = "Enter your password";
      document.querySelector("#input-login").textContent = "Login";
      const p = login.querySelector(".login-form p");
      if (p) p.textContent = "Don't have an account?";
      document.querySelector("#input-register").textContent = "Sign Up";
    }
  
    // [2] 밴 화면
    const banned = document.querySelector(".banned-div");
    if (banned) {
      banned.querySelector("strong").textContent = "You are banned.";
      banned.querySelector("p").innerHTML =
        "<strong>Information and Communications Network Act</strong> violation: you have been banned for inappropriate language or fraudulent activity.";
      document.querySelector("#ban_reason").textContent = "Loading...";
    }
  
    // [3] 메인 메뉴
    const main = document.querySelector(".main-menu");
    if (main) {
      main.querySelector(".importantArticle strong").textContent = "Loading...";
      main.querySelector(".importantArticle p").textContent = "Loading...";
  
      const mainStrong = main.querySelectorAll("strong");
      if (mainStrong.length > 0) {
        mainStrong.forEach((s) => {
          if (s.textContent === "내 프로필") s.textContent = "My Profile";
          if (s.textContent === "친구") s.textContent = "Friends";
          if (s.textContent === "그룹챗") s.textContent = "Group Chats";
          if (s.textContent === "친구 추가") s.textContent = "Add Friend";
          if (s.textContent === "그룹챗 추가") s.textContent = "Add Group Chat";
          if (s.textContent === "문의사항") s.textContent = "Contact Us";
        });
      }
  
      document.querySelector("#input-add-friend").placeholder = "Enter friend ID";
      document.querySelector("#input-add-friend-btn").textContent = "Add Friend";
      document.querySelector("#input-add-group").placeholder = "Enter group chat ID";
      document.querySelector("#input-add-group-btn").textContent = "Add Group Chat";
      document.querySelector("#make_group_chat").textContent = "Create Group Chat";
  
      // 문의사항 메뉴
      document.querySelectorAll(".menu_name").forEach((el) => {
        if (el.textContent.includes("유저의 소리")) el.textContent = "User Feedback 📢";
        if (el.textContent.includes("개발자의 소리")) el.textContent = "Developer Notes 📢";
      });
      document.querySelectorAll(".menu_desc").forEach((el) => {
        if (el.dataset.menu === "user_voice") el.textContent = "Tell us your opinion!";
        if (el.dataset.menu === "developer_voice") el.textContent = "Developer updates & news";
      });
    }
  
    // [3-1] 네비게이션 메뉴
    document.querySelectorAll(".navigation_item p").forEach((el) => {
      if (el.textContent === "내 프로필") el.textContent = "My Profile";
      if (el.textContent === "친구") el.textContent = "Friends";
      if (el.textContent === "그룹챗") el.textContent = "Group Chats";
      if (el.textContent === "추가") el.textContent = "Add";
      if (el.textContent === "공지사항") el.textContent = "Announcements";
    });
  
    // [4] 프로필 수정
    const profileEdit = document.querySelector(".profile-edit");
    if (profileEdit) {
    profileEdit.querySelector("strong").textContent = "Edit Profile";

    const profileStrong = profileEdit.querySelectorAll(".user-info strong");
    if (profileStrong.length >= 2) {
        profileStrong[0].textContent = "Edit Status Message";
        profileStrong[1].textContent = "Change Language";
    }

    document.querySelector("#edit_profile_message").placeholder = "Enter your status message";

    const countrySelect = document.querySelector("#countrys");
    if (countrySelect) {
        countrySelect.querySelector('option[value="kr"]').textContent = "Korean";
        countrySelect.querySelector('option[value="en"]').textContent = "English";
    }

    document.querySelector("#apply_profile_edit").textContent = "Apply";

    // ✅ 체크박스 라벨 2개 모두 영어화
    const labels = profileEdit.querySelectorAll("label");
    labels.forEach((label) => {
        const input = label.querySelector("input");
        if (input) {
        if (input.id === "light-mode-toggle") {
            label.innerHTML = `<input type="checkbox" id="light-mode-toggle"> Light Mode`;
        }
        if (input.id === "translate-preview-toggle") {
            label.innerHTML = `<input type="checkbox" id="translate-preview-toggle"> Translation Preview`;
        }
        }
    });
    }

  
    // [5] 그룹챗 만들기
    const makeGroup = document.querySelector(".make_group_chat");
    if (makeGroup) {
      makeGroup.querySelector("strong").textContent = "Create Group Chat";
      document.querySelector("#input-make-group-chat").placeholder = "Enter group chat name";
      document.querySelector("#apply_make_group_chat").textContent = "Create";
    }
  
    // [6] 채팅창 (일반)
    const chat = document.querySelector(".chatting");
    if (chat) {
      const partner = chat.querySelector("#partner-id");
      if (partner && partner.textContent.includes("로딩중"))
        partner.textContent = "Loading...";
      const textbox = chat.querySelector("#textbox");
      if (textbox) textbox.placeholder = "Type your message here.";
    }
  
    // [7] 번역 팝업
    const popup = document.querySelector(".previewtranslate");
    if (popup) {
      popup.querySelector("strong").textContent = "Translation Preview";
      popup.querySelector("p").innerHTML = "Please review the translation below. If it looks good, press <b>Confirm</b>.";
      popup.querySelector("#confirm_translate").textContent = "Confirm";
      popup.querySelector("#reload_translate").textContent = "Regenerate";
    }
  
    // [8] Nova AI
    const AItextbox = document.querySelector("#AItextbox");
    if (AItextbox) AItextbox.placeholder = "Type your message here.";
    const AIsend = document.querySelector("#AIsend_btn img");
    if (AIsend) AIsend.alt = "Send";
  
    // [9] 유저의 소리
    const userVoice = document.querySelector(".user_voice");
    if (userVoice) {
      userVoice.querySelector("strong").textContent = "Contact Us";
      userVoice.querySelector("p").textContent = "Contribute to MN Chat’s improvement!";
      userVoice.querySelector(".contact_textarea").placeholder = "Please write your feedback here :D";
      userVoice.querySelector(".contact_input").placeholder = "Enter your email address";
      userVoice.querySelector(".contact_label").textContent = "This is not a prank message.";
      userVoice.querySelector(".submit_contact").textContent = "Submit";
    }
  
    // [10] 개발자의 소리 목록
    const devVoice = document.querySelector(".developVoice");
    if (devVoice) {
      devVoice.querySelector("strong").textContent = "Patch Notes & Announcements!";
    }
  
    // [11] 개발자의 소리 - 상세
    const devContent = document.querySelector(".developVoiceContent");
    if (devContent) {
      devContent.querySelector(".voice-title").textContent = "Title Loading...";
      devContent.querySelector(".voice-text").textContent = "Content Loading...";
    }
    
    // [12] 누락된 텍스트들 추가
    // Nova AI 설명 텍스트
    const novaDesc = document.querySelector(".user-description");
    if (novaDesc && novaDesc.textContent.includes("새로운 AI 친구")) {
        novaDesc.textContent = "Meet Nova, your new AI friend.";
    }
    
    // HTML 하드코딩된 "로딩중" 텍스트들
    document.querySelectorAll("*").forEach((el) => {
        if (el.textContent === "로딩중 입니다...") {
            el.textContent = "Loading...";
        }
        if (el.textContent === "로딩중입니다...") {
            el.textContent = "Loading...";
        }
    });
    
    // 그룹챗 관련 텍스트
    const groupName = document.querySelector(".group_name");
    if (groupName && groupName.textContent === "테스트입니다.") {
        groupName.textContent = "Test Group";
    }
    
    // 메뉴 설명 텍스트들
    document.querySelectorAll(".menu_desc").forEach((el) => {
        if (el.textContent === "개발자야 이것좀 고쳐봐!") {
            el.textContent = "Tell us your opinion!";
        }
        if (el.textContent === "개발자야 너 뭐하냐") {
            el.textContent = "Developer updates & news";
        }
    });
    
    // 언어 옵션 텍스트
    const krOption = document.querySelector('option[value="kr"]');
    if (krOption && krOption.textContent === "한국어") {
        krOption.textContent = "Korean";
    }
    
    // 체크박스 라벨들
    document.querySelectorAll("label").forEach((label) => {
        if (label.textContent === "라이트모드") {
            label.innerHTML = `<input type="checkbox" id="light-mode-toggle"> Light Mode`;
        }
        if (label.textContent === "번역 미리보기") {
            label.innerHTML = `<input type="checkbox" id="translate-preview-toggle"> Translation Preview`;
        }
        if (label.textContent === "장난글이 아닙니다.") {
            label.textContent = "This is not a prank message.";
        }
    });
    
    // 버튼 텍스트들
    const applyBtn = document.querySelector("#apply_profile_edit");
    if (applyBtn && applyBtn.textContent === "적용") {
        applyBtn.textContent = "Apply";
    }
    
    const submitBtn = document.querySelector(".submit_contact");
    if (submitBtn && submitBtn.textContent === "완료") {
        submitBtn.textContent = "Submit";
    }
    
    // 입력 필드 placeholder들
    const contactTextarea = document.querySelector(".contact_textarea");
    if (contactTextarea && contactTextarea.placeholder.includes("여기에 입력해주세요")) {
        contactTextarea.placeholder = "Please write your feedback here :D";
    }
    
    const contactInput = document.querySelector(".contact_input");
    if (contactInput && contactInput.placeholder.includes("여기에 입력해주세요")) {
        contactInput.placeholder = "Enter your email address";
    }
    
    const textbox = document.querySelector("#textbox");
    if (textbox && textbox.placeholder.includes("여기에 메시지를 입력하세요")) {
        textbox.placeholder = "Type your message here.";
    }
    
    const AItextbox2 = document.querySelector("#AItextbox");
    if (AItextbox2 && AItextbox2.placeholder.includes("여기에 메시지를 입력하세요")) {
        AItextbox2.placeholder = "Type your message here.";
    }
    
    const profileMessage = document.querySelector("#edit_profile_message");
    if (profileMessage && profileMessage.placeholder.includes("여기에 상태메시지 입력")) {
        profileMessage.placeholder = "Enter your status message";
    }
    
    const groupChatInput = document.querySelector("#input-make-group-chat");
    if (groupChatInput && groupChatInput.placeholder.includes("그룹챗 이름 입력")) {
        groupChatInput.placeholder = "Enter group chat name";
    }
    
    const friendInput = document.querySelector("#input-add-friend");
    if (friendInput && friendInput.placeholder.includes("친구 아이디 입력")) {
        friendInput.placeholder = "Enter friend ID";
    }
    
    const groupInput = document.querySelector("#input-add-group");
    if (groupInput && groupInput.placeholder.includes("그룹챗 아이디 입력")) {
        groupInput.placeholder = "Enter group chat ID";
    }
    
    // alt 텍스트들
    const imageAlt = document.querySelector('img[alt="이미지보내기"]');
    if (imageAlt) imageAlt.alt = "Send Image";
    
    const sendAlt = document.querySelectorAll('img[alt="보내기"]');
    sendAlt.forEach((img) => {
        img.alt = "Send";
    });
  }

/**
 * UI를 한국어로 바꾸는 함수!!
 */
function changeui_ko() {
    // 시스템 메시지
    IDPWnotcorrect = "아이디 혹은 비밀번호가 일치하지 않습니다.";
    SIGNUPok = "회원가입 성공! 다시 로그인 해주세요.";
    FRIENDok1 = "친구 추가 성공!";
    FRIENDok2 = "상대도 당신에게 친구추가를 하면 친구가 됩니다.";
    PfOk = "프로필 수정이 완료되었습니다.";
    RefreshToApply = "변경하기 위해 다시 로그인 해주십시오.";
    CheckTranslate = "번역본 보기";
    GroupChatOK = "관리자에게 요청이 전송되었습니다. 허용 시 참여됩니다.";
    GroupChatOK2 = "그룹챗 만들기 성공!";
    
    // 추가 alert 메시지 한국어로 복원
    GroupChatLoadError = "그룹 채팅방을 불러오지 못했습니다.";
    FriendListLoadError = "친구 목록을 불러오지 못했습니다.";
    FriendDeleted = "친구가 삭제되었습니다.";
    FriendNotInList = "이미 친구목록에 없습니다.";
    FriendDeleteError = "삭제 중 오류가 발생했습니다.";
    GroupListLoadError = "그룹 목록을 불러오지 못했습니다.";
    GroupLeft = "그룹에서 나갔습니다.";
    GroupNotFound = "그룹을 찾을 수 없습니다.";
    GroupLeaveError = "그룹 나가기 중 오류가 발생했습니다.";
    UnknownError = "알 수 없는 오류가 발생했습니다.";
    GroupJoined = "그룹챗에 참여했습니다.";
    GroupJoinError = "오류가 발생하여 그룹챗에 참여하지 못했습니다.";
    FeatureNotReady = "해당 기능은 아직 완성되지 않았습니다.";
    CheckNotPrank = "장난글이 아니라는 체크를 해주세요!";
    FillEmailContent = "이메일과 내용을 모두 입력해주세요.";
    ContactSuccess = "문의가 성공적으로 접수되었습니다! ✉️";
    ContactFailed = "문의 전송에 실패했습니다. 다시 시도해주세요. ⚠️";
    
    // 번역 관련 메시지 한국어로 복원
    Translating = "번역본을 불러오고 있습니다...";
    Retranslating = "번역본을 새로 불러오고 있습니다...";
    TranslationFailed = "번역본을 불러오지 못했습니다.";
    document.querySelector('#translation_prompt').placeholder = "번역할때 AI가 참고할게요!";
    
    // 번역 지연 안내 메시지 한국어로 변경
    const translationInfo = document.querySelector("#information");
    if (translationInfo) {
        translationInfo.textContent = "한국어가 아닌 언어를 사용하는 경우 번역으로 인해 게시물이 약간 지연될 수 있습니다.";
    }
  
    // [1] 로그인 페이지
    document.querySelectorAll("#app-title").forEach((el) => {
      if (el.textContent === "Login") el.textContent = "로그인";
      if (el.textContent === "Service Access Restricted")
        el.textContent = "서비스 이용 불가 안내";
      if (el.textContent === "Create Group Chat")
        el.textContent = "그룹챗 만들기";
      if (el.textContent === "MN Chat") el.textContent = "MN Chat";
      if (el.textContent === "User Feedback 📢") el.textContent = "유저의 소리📢";
      if (el.textContent === "Developer Notes 📢") el.textContent = "개발자의 소리📢";
      if (el.textContent === "Nova AI") el.textContent = "Nova AI";
    });
  
    const login = document.querySelector(".login");
    if (login) {
      const strong = login.querySelector("strong");
      if (strong) strong.textContent = "채팅앱에 오신 것을 환영합니다.";
      document.querySelector("#input-id").placeholder = "ID 입력";
      document.querySelector("#input-pw").placeholder = "비밀번호 입력";
      document.querySelector("#input-login").textContent = "로그인";
      const p = login.querySelector(".login-form p");
      if (p) p.textContent = "계정이 없으시다면:";
      document.querySelector("#input-register").textContent = "회원가입";
    }
  
    // [2] 밴 화면
    const banned = document.querySelector(".banned-div");
    if (banned) {
      banned.querySelector("strong").textContent = "차단되었습니다.";
      banned.querySelector("p").innerHTML =
        "<strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong>에 의거, 부적절한 표현 사용 혹은 사기로 의해 차단당하셨습니다.";
      document.querySelector("#ban_reason").textContent = "로딩중 입니다...";
    }
  
    // [3] 메인 메뉴
    const main = document.querySelector(".main-menu");
    if (main) {
      main.querySelector(".importantArticle strong").textContent = "로딩중 입니다...";
      main.querySelector(".importantArticle p").textContent = "로딩중 입니다...";
  
      const mainStrong = main.querySelectorAll("strong");
      if (mainStrong.length > 0) {
        mainStrong.forEach((s) => {
          if (s.textContent === "My Profile") s.textContent = "내 프로필";
          if (s.textContent === "Friends") s.textContent = "친구";
          if (s.textContent === "Group Chats") s.textContent = "그룹챗";
          if (s.textContent === "Add Friend") s.textContent = "친구 추가";
          if (s.textContent === "Add Group Chat") s.textContent = "그룹챗 추가";
          if (s.textContent === "Contact Us") s.textContent = "문의사항";
        });
      }
  
      document.querySelector("#input-add-friend").placeholder = "친구 아이디 입력";
      document.querySelector("#input-add-friend-btn").textContent = "친구 추가";
      document.querySelector("#input-add-group").placeholder = "그룹챗 아이디 입력";
      document.querySelector("#input-add-group-btn").textContent = "그룹챗 추가";
      document.querySelector("#make_group_chat").textContent = "그룹챗 만들기";
  
      // 문의사항 메뉴
      document.querySelectorAll(".menu_name").forEach((el) => {
        if (el.textContent.includes("User Feedback")) el.textContent = "유저의 소리📢";
        if (el.textContent.includes("Developer Notes")) el.textContent = "개발자의 소리📢";
      });
      document.querySelectorAll(".menu_desc").forEach((el) => {
        if (el.dataset.menu === "user_voice") el.textContent = "개발자야 이것좀 고쳐봐!";
        if (el.dataset.menu === "developer_voice") el.textContent = "개발자야 너 뭐하냐";
      });
    }
  
    // [3-1] 네비게이션 메뉴
    document.querySelectorAll(".navigation_item p").forEach((el) => {
      if (el.textContent === "My Profile") el.textContent = "내 프로필";
      if (el.textContent === "Friends") el.textContent = "친구";
      if (el.textContent === "Group Chats") el.textContent = "그룹챗";
      if (el.textContent === "Add") el.textContent = "추가";
      if (el.textContent === "Announcements") el.textContent = "공지사항";
    });
  
    // [4] 프로필 수정
    const profileEdit = document.querySelector(".profile-edit");
    if (profileEdit) {
    profileEdit.querySelector("strong").textContent = "프로필 수정";

    const profileStrong = profileEdit.querySelectorAll(".user-info strong");
    if (profileStrong.length >= 2) {
        profileStrong[0].textContent = "상태메시지 수정";
        profileStrong[1].textContent = "언어 수정";
    }

    document.querySelector("#edit_profile_message").placeholder = "여기에 상태메시지 입력";

    const countrySelect = document.querySelector("#countrys");
    if (countrySelect) {
        countrySelect.querySelector('option[value="kr"]').textContent = "한국어";
        countrySelect.querySelector('option[value="en"]').textContent = "English";
    }

    document.querySelector("#apply_profile_edit").textContent = "적용";

    // ✅ 체크박스 라벨 2개 모두 한국어화
    const labels = profileEdit.querySelectorAll("label");
    labels.forEach((label) => {
        const input = label.querySelector("input");
        if (input) {
        if (input.id === "light-mode-toggle") {
            label.innerHTML = `<input type="checkbox" id="light-mode-toggle"> 라이트모드`;
        }
        if (input.id === "translate-preview-toggle") {
            label.innerHTML = `<input type="checkbox" id="translate-preview-toggle"> 번역 미리보기`;
        }
        }
    });
    }

  
    // [5] 그룹챗 만들기
    const makeGroup = document.querySelector(".make_group_chat");
    if (makeGroup) {
      makeGroup.querySelector("strong").textContent = "그룹챗 만들기";
      document.querySelector("#input-make-group-chat").placeholder = "그룹챗 이름 입력";
      document.querySelector("#apply_make_group_chat").textContent = "그룹챗 만들기";
    }
  
    // [6] 채팅창 (일반)
    const chat = document.querySelector(".chatting");
    if (chat) {
      const partner = chat.querySelector("#partner-id");
      if (partner && partner.textContent.includes("Loading"))
        partner.textContent = "로딩중입니다...";
      const textbox = chat.querySelector("#textbox");
      if (textbox) textbox.placeholder = "여기에 메시지를 입력하세요.";
    }
  
    // [7] 번역 팝업
    const popup = document.querySelector(".previewtranslate");
    if (popup) {
      popup.querySelector("strong").textContent = "번역 미리보기";
      popup.querySelector("p").innerHTML = "AI는 실수할 수 있습니다. AI번역 결과를 보시고, 다시 생성할지 결정해주십시오.";
      popup.querySelector("#confirm_translate").textContent = "확인";
      popup.querySelector("#reload_translate").textContent = "재생성";
    }
  
    // [8] Nova AI
    const AItextbox = document.querySelector("#AItextbox");
    if (AItextbox) AItextbox.placeholder = "여기에 메시지를 입력하세요.";
    const AIsend = document.querySelector("#AIsend_btn img");
    if (AIsend) AIsend.alt = "보내기";
  
    // [9] 유저의 소리
    const userVoice = document.querySelector(".user_voice");
    if (userVoice) {
      userVoice.querySelector("strong").textContent = "문의사항";
      userVoice.querySelector("p").textContent = "MN Chat의 발전에 기여해주세요!";
      userVoice.querySelector(".contact_textarea").placeholder = "여기에 입력해주세요 :D";
      userVoice.querySelector(".contact_input").placeholder = "여기에 입력해주세요 :D";
      userVoice.querySelector(".contact_label").textContent = "장난글이 아닙니다.";
      userVoice.querySelector(".submit_contact").textContent = "완료";
    }
  
    // [10] 개발자의 소리 목록
    const devVoice = document.querySelector(".developVoice");
    if (devVoice) {
      devVoice.querySelector("strong").textContent = "패치노트 및 공지사항!";
    }
  
    // [11] 개발자의 소리 - 상세
    const devContent = document.querySelector(".developVoiceContent");
    if (devContent) {
      devContent.querySelector(".voice-title").textContent = "타이틀 로드중";
      devContent.querySelector(".voice-text").textContent = "내용 로드중";
    }
    
    // [12] 누락된 텍스트들 한국어로 복원
    // Nova AI 설명 텍스트
    const novaDesc = document.querySelector(".user-description");
    if (novaDesc && novaDesc.textContent.includes("Meet Nova")) {
        novaDesc.textContent = "새로운 AI 친구, Nova를 만나보세요.";
    }
    
    // HTML 하드코딩된 "Loading" 텍스트들
    document.querySelectorAll("*").forEach((el) => {
        if (el.textContent === "Loading...") {
            el.textContent = "로딩중 입니다...";
        }
    });
    
    // 그룹챗 관련 텍스트
    const groupName = document.querySelector(".group_name");
    if (groupName && groupName.textContent === "Test Group") {
        groupName.textContent = "테스트입니다.";
    }
    
    // 메뉴 설명 텍스트들
    document.querySelectorAll(".menu_desc").forEach((el) => {
        if (el.textContent === "Tell us your opinion!") {
            el.textContent = "개발자야 이것좀 고쳐봐!";
        }
        if (el.textContent === "Developer updates & news") {
            el.textContent = "개발자야 너 뭐하냐";
        }
    });
    
    // 언어 옵션 텍스트
    const krOption = document.querySelector('option[value="kr"]');
    if (krOption && krOption.textContent === "Korean") {
        krOption.textContent = "한국어";
    }
    
    // 체크박스 라벨들
    document.querySelectorAll("label").forEach((label) => {
        if (label.textContent === "Light Mode") {
            label.innerHTML = `<input type="checkbox" id="light-mode-toggle"> 라이트모드`;
        }
        if (label.textContent === "Translation Preview") {
            label.innerHTML = `<input type="checkbox" id="translate-preview-toggle"> 번역 미리보기`;
        }
        if (label.textContent === "This is not a prank message.") {
            label.textContent = "장난글이 아닙니다.";
        }
    });
    
    // 버튼 텍스트들
    const applyBtn = document.querySelector("#apply_profile_edit");
    if (applyBtn && applyBtn.textContent === "Apply") {
        applyBtn.textContent = "적용";
    }
    
    const submitBtn = document.querySelector(".submit_contact");
    if (submitBtn && submitBtn.textContent === "Submit") {
        submitBtn.textContent = "완료";
    }
    
    // 입력 필드 placeholder들
    const contactTextarea = document.querySelector(".contact_textarea");
    if (contactTextarea && contactTextarea.placeholder.includes("Please write your feedback")) {
        contactTextarea.placeholder = "여기에 입력해주세요 :D";
    }
    
    const contactInput = document.querySelector(".contact_input");
    if (contactInput && contactInput.placeholder.includes("Enter your email")) {
        contactInput.placeholder = "여기에 입력해주세요 :D";
    }
    
    const textbox = document.querySelector("#textbox");
    if (textbox && textbox.placeholder.includes("Type your message")) {
        textbox.placeholder = "여기에 메시지를 입력하세요.";
    }
    
    const AItextbox2 = document.querySelector("#AItextbox");
    if (AItextbox2 && AItextbox2.placeholder.includes("Type your message")) {
        AItextbox2.placeholder = "여기에 메시지를 입력하세요.";
    }
    
    const profileMessage = document.querySelector("#edit_profile_message");
    if (profileMessage && profileMessage.placeholder.includes("Enter your status")) {
        profileMessage.placeholder = "여기에 상태메시지 입력";
    }
    
    const groupChatInput = document.querySelector("#input-make-group-chat");
    if (groupChatInput && groupChatInput.placeholder.includes("Enter group chat")) {
        groupChatInput.placeholder = "그룹챗 이름 입력";
    }
    
    const friendInput = document.querySelector("#input-add-friend");
    if (friendInput && friendInput.placeholder.includes("Enter friend")) {
        friendInput.placeholder = "친구 아이디 입력";
    }
    
    const groupInput = document.querySelector("#input-add-group");
    if (groupInput && groupInput.placeholder.includes("Enter group chat")) {
        groupInput.placeholder = "그룹챗 아이디 입력";
    }
    
    // alt 텍스트들
    const imageAlt = document.querySelector('img[alt="Send Image"]');
    if (imageAlt) imageAlt.alt = "이미지보내기";
    
    const sendAlt = document.querySelectorAll('img[alt="Send"]');
    sendAlt.forEach((img) => {
        img.alt = "보내기";
    });
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
                        my_TP = data.data.TP
                        if (data.data.light) {
                            document.body.classList.add('light-mode');
                        }
                        if (my_lang == "en") {
                            changeui_en();
                        } else if (my_lang == "kr") {
                            changeui_ko();
                        }
                        
                        // 한국어가 아닌 사용자에게 번역 지연 안내 메시지 표시
                        const translationInfo = document.querySelector("#information");
                        if (translationInfo && my_lang !== "kr") {
                            translationInfo.style.display = "block";
                        }
                        console.log(my_id);
                        display_friendlist();
                        display_grouplist();
                        
                        // 라이트모드 토글 설정
                        setupLightModeToggle();
                        setupTPToggle();
                        
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
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    edit_profile_div.style.display = "flex";
    aichatting_div.style.display = "none";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    
    // 프로필 편집 화면에서 라이트모드 토글 다시 설정
    setupLightModeToggle();
    setupTPToggle();
}

//data.message
//edit_profile(id, mes);

let selectedProfileBase64 = "";
let input_editing_desc = document.querySelector("#edit_profile_message");
let apply_editing_desc = document.querySelector("#apply_profile_edit");
let profileImageInput = document.querySelector("#edit_profile_image");
let previewProfileImg = document.querySelector("#preview_profile_img");
let language_select = document.querySelector("#countrys");
let TPcheckbox = document.querySelector('#translate-preview-toggle');
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
    const TPcheckbox = document.querySelector('#translate-preview-toggle'); // ✅ 매번 새로 가져오기
    const lightModeToggle = document.querySelector('#light-mode-toggle');  // 이것도 같이!
    console.log(input_editing_desc.value !== my_desc, selectedProfileBase64 !== "", language_select.value !== my_lang, TPcheckbox.checked !== my_TP);
    console.log(my_desc, selectedProfileBase64, my_lang,my_light, my_TP);
    console.log(input_editing_desc, selectedProfileBase64, language_select.value, lightModeToggle.checked, TPcheckbox.checked)
    if (
        input_editing_desc.value !== my_desc ||
        selectedProfileBase64 !== "" ||
        language_select.value !== my_lang ||
        lightModeToggle.checked !== my_light ||
        TPcheckbox.checked !== my_TP
    ) {
        console.log("OK!");
        edit_profile(
            my_id,
            input_editing_desc.value,
            selectedProfileBase64,
            language_select.value,
            lightModeToggle.checked,
            TPcheckbox.checked
        ).then((data) => {
            console.log(data);
            if (data.message === "1") {
                alert(PfOk);
                alert(RefreshToApply);
                location.reload();
            } else {
                alert(UnknownError);
                console.error("Front Error.");
                display_friendlist();
            }
        });
    }
});


let lightModeToggle = document.querySelector("#light-mode-toggle"); // 하이픈(-)으로!

// 라이트모드 토글 이벤트 리스너 설정 함수
function setupLightModeToggle() {
    lightModeToggle = document.querySelector("#light-mode-toggle");
    if (lightModeToggle) {
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
    }
}

function setupTPToggle() {
    const TPToggle = document.querySelector('#translate-preview-toggle');
    if (TPToggle) {
        console.log("현재 my_TP:", my_TP);
        TPToggle.checked = Boolean(my_TP); // ✅ 강제 논리형 변환
    }
}

let apply_make_group_chat = document.querySelector("#apply_make_group_chat");
let input_make_group_chat = document.querySelector("#input-make-group-chat");
let make_group_chat = document.querySelector("#make_group_chat");
let input_add_group_btn = document.querySelector("#input-add-group-btn");
let input_add_group = document.querySelector("#input-add-group");

input_add_group_btn.addEventListener('click', ()=>{
    if (input_add_group.value) {
        join_groupchat(input_add_group.value, my_id).then((data) => {
            if (data.message === "1") {
                alert(GroupJoined);
                display_grouplist();
            } else {
                alert(GroupJoinError);
            }
        });
    }
});

// 그룹챗 제작 화면
function display_making_group() {
    chatting_div.style.display = "none";
    edit_profile_div.style.display = "none";
    mainmenu_div.style.display = "none";
    mainmenu_navigation_div.style.display = "none";
    login_div.style.display = "none";
    make_group_chat_div.style.display = "flex";
    aichatting_div.style.display = "none";
    developVoiceContent_div.style.display = "none";
    developVoice_div.style.display = "none";
    userVoice_div.style.display = 'none';
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
// ✅ 메뉴 클릭 이벤트 바인딩
document.querySelectorAll(".menu_info").forEach((ele) => {
    ele.addEventListener("click", () => {
        const menuType = ele.querySelector(".menu_desc").dataset.menu;
        if (menuType === "developer_voice") {
            display_developervoice();
        } else if (menuType === "user_voice") {
            display_uservoice();
        }else {
            alert(FeatureNotReady)
        }
    });
});

document.querySelector(".submit_contact").addEventListener("click", async () => {
    const email = document.querySelector("#contact_email").value.trim();
    const content = document.querySelector("#contact_content").value.trim();
    const check = document.querySelector("#contact_check").checked;

    if (!check) {
        alert(CheckNotPrank);
        return;
    }

    if (!email || !content) {
        alert(FillEmailContent);
        return;
    }

    const result = await submit_contact(my_id, content, email);

    if (result && result.success) {
        alert(ContactSuccess);
        // 초기화도 가능:
        document.querySelector("#contact_email").value = "";
        document.querySelector("#contact_content").value = "";
        document.querySelector("#contact_check").checked = false;
    } else {
        alert(ContactFailed);
    }
});

// 네비게이션 메뉴 관련 이벤트 핸들러
const navigationFull = document.querySelector(".main-menu-navigation .full");
const navigationLogo = document.querySelector(".main-menu-navigation > img");
const mainMenuContainer = document.querySelector(".main-menu-container");

// 로고 클릭 시 full 메뉴 토글
if (navigationLogo) {
    navigationLogo.addEventListener("click", () => {
        if (navigationFull) {
            const isVisible = navigationFull.style.display !== "none";
            navigationFull.style.display = isVisible ? "none" : "flex";
        }
    });
}

// 네비게이션 아이템 클릭 시 해당 section으로 스크롤
function scrollToSection(sectionId) {
    if (mainmenu_div.style.display === "none") {
        return; // main-menu가 보이지 않으면 동작하지 않음
    }
    
    const section = document.querySelector(sectionId);
    if (!section) {
        return;
    }
    
    // main-menu-container가 스크롤 가능한 경우
    if (mainMenuContainer) {
        const containerRect = mainMenuContainer.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const scrollTop = mainMenuContainer.scrollTop || 0;
        const targetScroll = scrollTop + sectionRect.top - containerRect.top - 20; // 20px 여백
        
        mainMenuContainer.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "smooth"
        });
    } else {
        // main-menu-container가 없으면 main-menu에서 스크롤
        const menuRect = mainmenu_div.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const scrollTop = mainmenu_div.scrollTop || 0;
        const targetScroll = scrollTop + sectionRect.top - menuRect.top - 20;
        
        mainmenu_div.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "smooth"
        });
    }
    
    // full 메뉴 닫기
    if (navigationFull) {
        navigationFull.style.display = "none";
    }
}

// 네비게이션 아이템 매핑
const navigationMap = {
    "item_profile": "#profile_section",
    "item_profile2": "#profile_section",
    "item_friends": "#friend_section",
    "item_friends2": "#friend_section",
    "item_group": "#group_section",
    "item_group2": "#group_section",
    "item_addfriends": "#addfriend_section",
    "item_addfriends2": "#addfriend_section",
    "item_announce": "#announce_section",
    "item_announce2": "#announce_section"
};

// 모든 네비게이션 아이템에 이벤트 리스너 추가
Object.keys(navigationMap).forEach(itemId => {
    const element = document.querySelector(`#${itemId}`);
    if (element) {
        element.addEventListener("click", () => {
            scrollToSection(navigationMap[itemId]);
        });
    }
});

Notification.requestPermission()