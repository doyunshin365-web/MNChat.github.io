// PORT 3000 : 채팅 앱

// 변수 지정
let my_id = '';
let chatting_div = document.querySelector('.chatting');
let mainmenu_div = document.querySelector('.main-menu');
let login_div = document.querySelector('.login');
let edit_profile_div = document.querySelector('.profile-edit');
let send_btn = document.querySelector('#send_btn');
let container = document.querySelector('.container');
let textbox = document.querySelector('#textbox');
let partner_id_render = document.querySelector('#partner-id');
let friends_list = document.querySelector('.friends_container');
let back_btn = document.querySelectorAll('.back_main');
let partner_id = '';
const socket = io(); 
let partner_lang = '';
let IDPWnotcorrect = "아이디 혹은 비밀번호가 일치하지 않습니다.";
let SIGNUPok = "회원가입 성공! 다시 로그인 해주세요.";
let FRIENDok1 = "친구 추가 성공!";
let FRIENDok2 = "상대도 당신에게 친구추가를 하면 친구가 됩니다.";
let PfOk = "프로필 수정이 완료되었습니다.";
let RefreshToApply = "변경하기 위해 다시 로그인 해주십시오.";
let CheckTranslate = "번역본 보기";

/**
 * 상대가 보낸 이미지를 채팅 화면에 띄워주는 함수.
 * @param {string} content 
 */
function make_partner_image(base64) {
    container.insertAdjacentHTML('beforeend', `
        <div class="partner-chat">
            <img src="${base64}" class="chat-image">
        </div>
    `);
}

/**
 * 내내가 보낸 이미지를 채팅 화면에 띄워주는 함수.
 * @param {string} content 
 */
function make_my_image(base64) {
    container.insertAdjacentHTML('beforeend', `
        <div class="my-chat">
            <img src="${base64}" class="chat-image">
        </div>
    `);
}

/**
 * 내가 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content 
 */
function make_my_chat(content) {
    container.insertAdjacentHTML('beforeend',`
        <div class="my-chat">
            <p>${content}</p>
        </div>
    `);
}

/**
 * 상대방이 보낸 채팅 화면에 띄워주는 함수.
 * @param {string} content 
 */
function make_partner_chat(content) {
    container.insertAdjacentHTML('beforeend',`
        <div class="partner-chat">
            <p>${content}</p>
        </div>
    `);
}

/**
 * 언어가 다를 경우를 대비해서 채팅에 띄울때 번역본도 함께 띄우도록
 * @param {string} content 
 */
function make_partner_chat_otherlang(content) {
    const div = document.createElement('div');
    div.classList.add('partner-chat');

    div.innerHTML = `
        <p class="content">${content}</p>
        <button class="show_translate">${CheckTranslate}</button>
    `;

    // 바로 이벤트 붙이기
    const btn = div.querySelector('.show_translate');
    btn.addEventListener('click', async () => {
        let translated = div.querySelector('.translated');
        if (!translated) {
            translated = document.createElement('p');
            translated.classList.add('translated');
            translated.textContent = "번역본을 불러오고 있습니다...";
            div.appendChild(translated);
        } else {
            translated.textContent = "번역본을 새로 불러오고 있습니다...";
        }

        try {
            const result = await translate_text(partner_lang, my_lang, content);
            translated.textContent = result;
            btn.style.display = 'none'; // 번역 끝나면 버튼 숨기기
        } catch (err) {
            console.error("번역 오류 발생:", err);
            translated.textContent = "번역본을 불러오지 못했습니다.";
        }
    });

    container.appendChild(div);
}


send_btn.addEventListener('click',async ()=>{
    if (textbox.value) {
        make_my_chat(textbox.value);
    }
    const param = {
        from: my_id,
        to: partner_id,
        content: textbox.value
    };
    socket.emit('chatting', param);
    textbox.value = '';
    container.scrollTop = container.scrollHeight;
});

const uploadBtn = document.querySelector('#upload-btn');
const imageUpload = document.querySelector('#image-upload');

uploadBtn.addEventListener('click', () => {
    imageUpload.click(); // 버튼 누르면 input 클릭됨
});

imageUpload.addEventListener('change', () => {
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
            content: fullContent
        };
        socket.emit('chatting', param);
    };
    reader.readAsDataURL(file);
});

// @deprecated
// partner_id_render.addEventListener('click',()=>{
//     partner_id = prompt('ID를 입력해주세요:');
//     partner_id_render.textContent = partner_id;
// });

textbox.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // 폼 제출 방지
      send_btn.click(); // 버튼 클릭 이벤트 실행
    }
});

/**
 * 채팅방 입장하는 함수
 * @param {string} partner 
 */
async function enter_chat_room(partner) {
    partner_id = partner;
    chatting_div.style.display = 'flex';
    mainmenu_div.style.display = 'none';
    login_div.style.display = 'none';
    chatting_div.querySelector('.back_main').style.display = 'flex';
    container.innerHTML = '';

    // ✅ 먼저 partner_lang 세팅
    const data = await get_chattings(my_id, partner);
    partner_lang = data.partnerLanguage; 
    console.log(my_lang, partner_lang, my_lang !== partner_lang)

    // ✅ 이제 확실히 partner_lang이 세팅된 후에 채팅 기록 로드
    data.chattings.forEach(ele => {
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
                    make_partner_chat_otherlang(ele.content, partner_lang);
                } else {
                    make_partner_chat(ele.content);
                }
            }
        }
    });

    partner_id_render.textContent = partner;
    container.scrollTop = container.scrollHeight;
}


/**
 * 친구 목록 띄워주는 함수
 */
async function display_friendlist() {
    chatting_div.style.display = 'none';
    edit_profile_div.style.display = 'none';
    mainmenu_div.style.display = 'flex';
    login_div.style.display = 'none';
    mainmenu_div.querySelector('.back_main').style.display = 'none';
    friends_list.innerHTML = '';

    const data = await get_friends(my_id);
    if (data.message !== "2") {
        alert("친구 목록을 불러오지 못했습니다.");
        return;
    }

    const friends = data.friends;
    friends.forEach(friend => {
        console.log(friend);
        const profileSrc = (friend.pf === 'Default' || friend.pf === '') ? './imgs/default_pfp.png' : friend.pf;
        
        let translateBtnHtml = '';
        if (friend.lang && friend.lang !== my_lang) {
            translateBtnHtml = `
                <button class="translate-desc-btn" data-lang="${friend.lang}" data-desc="${friend.desc}">
                    <img src="./svgs/translate_desc.svg" alt="번역" class="translate-icon">
                </button>
            `;
        }
    
        friends_list.insertAdjacentHTML('beforeend', `
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
        `);
    });    

    // ✅ 채팅방 입장 이벤트
    document.querySelectorAll('.user-info').forEach(ele => {
        ele.addEventListener('click', () => {
            enter_chat_room(ele.closest('.user-table').dataset.id);
        });
    });

    // ✅ 친구 삭제 이벤트 (여기서 새로 바인딩)
    document.querySelectorAll('.delete-friend-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // 채팅방 입장 이벤트 막기
            const friendId = btn.dataset.id;
            if (confirm(`${friendId}님을 친구목록에서 삭제할까요?`)) {
                remove_friend(my_id, friendId).then(data => {
                    if (data.message === '2') {
                        alert("친구가 삭제되었습니다.");
                        display_friendlist(); // 새로고침
                    } else if (data.message === '-2') {
                        alert("이미 친구목록에 없습니다.");
                    } else {
                        alert("삭제 중 오류가 발생했습니다.");
                    }
                });
            }
        });
    });

    // ✅ 친구 상태메시지 번역 버튼
    document.querySelectorAll('.translate-desc-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // 채팅방 안 열리게 방지

            const friendLang = btn.dataset.lang;
            const friendDesc = btn.dataset.desc;

            const parent = btn.closest('.user-table');
            let translated = parent.querySelector('.translated-desc');

            if (!translated) {
                translated = document.createElement('p');
                translated.classList.add('translated-desc');
                translated.textContent = "번역 중입니다...";
                parent.querySelector('.user-info').appendChild(translated);
            } else {
                translated.textContent = "번역 새로고침 중...";
            }

            try {
                const result = await translate_text(friendLang, my_lang, friendDesc);
                translated.textContent = result;
                btn.style.display = 'none'; // 번역 끝나면 버튼 숨김
            } catch (err) {
                console.error("상태메시지 번역 오류:", err);
                translated.textContent = "번역 실패!";
            }
        });
    });

}

back_btn.forEach(ele => {
    ele.addEventListener('click',()=>{
        display_friendlist();
    });
});

function isImageContent(content) {
    return content.startsWith('#image/');
}

function extractBase64(content) {
    return content.replace('#image/', '');
}

socket.on('chatting', (data) => {
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
    }
});

// 여기서 부터 로그인 받아옴
chatting_div.style.display = 'none';
mainmenu_div.style.display = 'none';
login_div.style.display = 'flex';

let input_id = document.querySelector('#input-id');
let input_pw = document.querySelector('#input-pw');
let input_login = document.querySelector('#input-login');
let input_register = document.querySelector('#input-register');
let input_add_friend = document.querySelector('#input-add-friend')
let input_add_friend_btn = document.querySelector('#input-add-friend-btn')
let my_desc = '';
let my_lang = 'kr'; // default value

function display_ban(reason) {
    mainmenu_div.style.display = 'none';
    document.querySelector('#banned-div').style.display = 'flex';
    document.querySelector('#ban_reason').textContent = reason;
}

/**
 * UI를 영어로 바꾸는 함수!!
 */
function changeui_en() {
    // 로그인 화면
    IDPWnotcorrect = "The ID or password is incorrect.";
    SIGNUPok = "Sign up successful! Please log in again.";
    FRIENDok1 = "Friend added successfully!";
    FRIENDok2 = "Your friend also needs to add you to become friends.";
    PfOk = "Profile updated successfully.";
    RefreshToApply = "Please log in again to apply the changes.";
    CheckTranslate = "View Translation";
    document.querySelectorAll('#app-title').forEach(el => {
        if (el.textContent === '로그인') el.textContent = 'Login';
        if (el.textContent === '서비스 이용 불가 안내') el.textContent = 'Service Access Restricted';
        if (el.textContent === 'MN Chat') el.textContent = 'MN Chat';
    });

    const loginWelcome = document.querySelector('.login strong');
    if (loginWelcome) loginWelcome.textContent = 'Welcome to the Chat App.';

    const loginIdInput = document.querySelector('#input-id');
    if (loginIdInput) loginIdInput.placeholder = 'Enter your ID';

    const loginPwInput = document.querySelector('#input-pw');
    if (loginPwInput) loginPwInput.placeholder = 'Enter your password';

    const loginBtn = document.querySelector('#input-login');
    if (loginBtn) loginBtn.textContent = 'Login';

    const registerMsg = document.querySelector('.login-form p');
    if (registerMsg) registerMsg.textContent = 'Don\'t have an account?';

    const registerBtn = document.querySelector('#input-register');
    if (registerBtn) registerBtn.textContent = 'Sign Up';

    // 차단 화면
    const bannedStrong = document.querySelector('.banned-div strong');
    if (bannedStrong) bannedStrong.textContent = 'You are banned.';

    const bannedReasonMsg = document.querySelector('.banned-div p');
    if (bannedReasonMsg) bannedReasonMsg.textContent = 'According to the Information and Communications Network Act, you have been banned for inappropriate language or fraudulent activity.';

    const banReason = document.querySelector('#ban_reason');
    if (banReason) banReason.textContent = 'Loading...';

    // 메인 화면
    const myProfileTitle = document.querySelector('.main-menu strong');
    if (myProfileTitle) myProfileTitle.textContent = 'My Profile';

    const myName = document.querySelector('#my_name');
    if (myName && myName.textContent.includes('로딩중')) myName.textContent = 'Loading...';

    const myDesc = document.querySelector('#my_desc');
    if (myDesc && myDesc.textContent.includes('로딩중')) myDesc.textContent = 'Loading...';

    document.querySelectorAll('.main-menu strong').forEach(el => {
        if (el.textContent === '친구') el.textContent = 'Friends';
        if (el.textContent === '친구 추가') el.textContent = 'Add Friend';
    });

    const addFriendInput = document.querySelector('#input-add-friend');
    if (addFriendInput) addFriendInput.placeholder = 'Enter friend ID';

    const addFriendBtn = document.querySelector('#input-add-friend-btn');
    if (addFriendBtn) addFriendBtn.textContent = 'Add Friend';

    // 프로필 수정 화면
    const profileEditTitle = document.querySelector('.profile-edit strong');
    if (profileEditTitle) profileEditTitle.textContent = 'Edit Profile';

    const statusMsgEdit = document.querySelector('.profile-edit .user-info strong');
    if (statusMsgEdit) statusMsgEdit.textContent = 'Edit Status Message';

    const editProfileMsg = document.querySelector('#edit_profile_message');
    if (editProfileMsg) editProfileMsg.placeholder = 'Enter your status message here';

    const languageEditStrong = document.querySelectorAll('.profile-edit .user-info strong')[1];
    if (languageEditStrong) languageEditStrong.textContent = 'Change Language';

    const countrySelect = document.querySelector('#countrys');
    if (countrySelect) {
        countrySelect.querySelector('option[value="kr"]').textContent = 'Korean';
        countrySelect.querySelector('option[value="en"]').textContent = 'English';
    }

    const applyProfileEdit = document.querySelector('#apply_profile_edit');
    if (applyProfileEdit) applyProfileEdit.textContent = 'Apply';

    // 채팅 화면
    const partnerId = document.querySelector('#partner-id');
    if (partnerId && partnerId.textContent.includes('로딩중')) partnerId.textContent = 'Loading...';

    const chatTextbox = document.querySelector('#textbox');
    if (chatTextbox) chatTextbox.placeholder = 'Type your message here.';
}


input_login.addEventListener('click',async ()=>{
    if (input_id.value && input_pw.value) {
        await try_login(input_id.value, input_pw.value).then( async data=>{
            if (data.data.message === '2') {
                await ban_check(my_id).then(data2=>{
                    if (data2.message === '1') {
                        // 여기서 밴 화면 띄우기
                    } else {
                        //문제 없음ㅋ
                        my_id = data.id;
                        console.log(data.data);
                        document.querySelector('#my_name').textContent = my_id;
                        document.querySelector('#my_desc').textContent = data.data.desc;
                        
                        if (data.data.pf !== 'Default' && data.data.pf !== '') {
                            document.querySelector('#my_pf').src = data.data.pf;
                            document.querySelector('#preview_profile_img').src = data.data.pf;
                        } else {
                            document.querySelector('#my_pf').src = './imgs/default_pfp.png';
                            document.querySelector('#preview_profile_img').src = './imgs/default_pfp.png';
                        }

                        document.querySelector('#edit_profile_message').value = data.data.desc;
                        my_desc = data.data.desc;
                        my_pf = data.data.pf;
                        my_lang = data.data.lang;
                        if (my_lang == 'en') {
                            changeui_en();
                        }
                        console.log(my_id);
                        display_friendlist();
                    }
                });
            } else {
                alert(IDPWnotcorrect)
            }
        });
    }
});

input_register.addEventListener('click',()=>{
    if (input_id.value && input_pw.value) {
        try_register(input_id.value, input_pw.value).then(data=>{
            if (data.message === '1') {
                alert(SIGNUPok)
            }
        });
    }
});

input_add_friend_btn.addEventListener('click',()=>{
    if (input_add_friend.value) {
        add_friend(my_id,input_add_friend.value).then(data=>{
            if (data.message === '2') {
                alert(FRIENDok1)
                alert(FRIENDok2)
                display_friendlist();
            }
        });
    }
});

function display_edit_profile() {
    chatting_div.style.display = 'none';
    mainmenu_div.style.display = 'none';
    login_div.style.display = 'none';
    edit_profile_div.style.display = 'flex';

}

//data.message
//edit_profile(id, mes);

let selectedProfileBase64 = '';
let input_editing_desc = document.querySelector('#edit_profile_message');
let apply_editing_desc = document.querySelector('#apply_profile_edit');
let profileImageInput = document.querySelector('#edit_profile_image');
let previewProfileImg = document.querySelector('#preview_profile_img');
let language_select = document.querySelector('#countrys');
//my_lang
language_select.value = my_lang;

profileImageInput.addEventListener('change', () => {
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

apply_editing_desc.addEventListener('click',async ()=>{
    if (input_editing_desc.value !== my_desc || selectedProfileBase64 !== '' || language_select.value !== my_lang) {
        console.log("OK!")
        edit_profile(my_id, input_editing_desc.value, selectedProfileBase64, language_select.value).then(data=>{
            console.log(data);
            if (data.message === '1') {
                alert(PfOk);
                alert(RefreshToApply)
                location.reload();
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
                console.error("Front Error.")
                display_friendlist();
            }
        });
    }
});

document.querySelector('.my_frofile').addEventListener('click', display_edit_profile);