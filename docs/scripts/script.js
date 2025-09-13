/**
 * 로그인 버튼을 눌렀을 때 서버와 통신해서 실제로 로그인 시키는 함수.
 */
// async function login() {
//     console.log("login 함수 실행중...");
//     let id_input = doc_div.querySelector("#id_bar");
//     let pw_input = doc_div.querySelector("#pw_bar");
//     let login_btn = doc_div.querySelector("#login_btn");
//     login_btn.disabled = false;
//     login_btn.addEventListener('click',()=>{
//         if (login_btn.disabled) return;
//         console.log(`user input : ${id_input.value} & ${pw_input.value}`);
//         login_btn.disabled = true;
//         users.forEach((i)=>{
//             console.log(`system : ${i['id']} & ${i['password']}`);
//             temp = false;
//             if (i['id'] === id_input.value) {
//                 if (i['password'] === pw_input.value) {
//                     alert("로그인 완료");
//                     logged = true;
//                     temp = true;
//                     username = i['id'];
//                 }
//             }
//         });
//         if (!temp) {
//             alert("로그인 실패. ID, PW를 다시 확인해주세요.");
//             display(3)
//         } else {
//             display(0)
//         }
//     });
// }

// 기존 login 함수와 이름이 같은 이유로, try_login임
/** 로그인 함수 (서버와 통신) */
async function try_login(id, pw) {
    const res = await fetch("/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, pw })
    });
    const data = await res.json();
    return {data, id};
}

async function try_register(id, pw) {
    const res = await fetch("/register", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, pw })
    });
    const data = await res.json();
    return {data , id};
}

async function get_friends(id) {
    const res = await fetch("/get_friends", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
    });
    const data = await res.json();
    return data;
}

async function add_friend(id1, id2) {
    const res = await fetch("/add_friend", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id1, id2 })
    });
    const data = await res.json();
    return data;
}

async function get_groups(id) {
    const res = await fetch("/get_groups", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    const data = await res.json();
    return data;
}


async function get_groupchat_history(groupId) {
    const res = await fetch("/get_groupchat_history", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
    });

    const data = await res.json();
    return data;
}

async function get_chattings(id1, id2) {
    const res = await fetch("/get_chattings", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id1, id2 })
    });
    const data = await res.json();
    return data;
}

async function ban_check(id) {
    const res = await fetch("/ban_check", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
    });
    const data = await res.json();
    return data;
}

async function edit_profile(id, mes, pf, country, light) {
    const res = await fetch("/edit_profile", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, mes, pf, country, light })
    });
    const data = await res.json();
    return data;
}


async function translate_text(country1, country2, content) {
    const res = await fetch("/translation", {  // 서버의 번역 엔드포인트
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country1, country2, content })
    });

    const data = await res.json();
    return data;
}

//debuging
// translate_text("Korean", "English", "번역 테스트입니다")
//     .then(result => {
//         console.log("번역 결과:", result);
//     })
//     .catch(err => console.error("번역 실패:", err));

async function remove_friend(id1, id2) {
    const res = await fetch("/remove_friend", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id1, id2 })
    });
    const data = await res.json();
    return data;
}

async function create_groupchat({ title, maker }) {
    const res = await fetch("/create_groupchat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, maker }),
    });
  
    const data = await res.json();
    return data;
  }

async function leave_groupchat(groupId, userId) {
    const res = await fetch("/leave_groupchat", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ groupId, userId })
    });
    const data = await res.json();
    return data;
}
  
async function join_groupchat(groupId, userId) {
    const res = await fetch("/join_groupchat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, userId }),
    });

    const data = await res.json();
    return data;
}

async function get_ainova_history(id) {
    const res = await fetch("/get_ainova_history", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
    });
    const data = await res.json();
    return data;
}

async function update_ainova_history(id, ainovaHistory) {
    const res = await fetch("/update_ainova_history", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, ainovaHistory })
    });
    const data = await res.json();
    return data;
}

async function nova_response(messages) {
    const res = await fetch("/nova_response", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ messages })
    });
    const data = await res.json();
    return data;
}