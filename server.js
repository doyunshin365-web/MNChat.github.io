const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const path = require("path");
const http = require("http");
const User = require("./docs/models/Users");
const Chatting = require("./docs/models/Chattings");
const GroupChatting = require("./docs/models/GroupChat");
const Ban = require("./docs/models/Banned");
const Contact = require("./docs/models/Contact");
const DevelopVoice = require("./docs/models/DevelopVoice");
const app = express();
const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server);

mongoose.connect(
  "mongodb+srv://doyunshin365:mNCNCCIPky88bW8b@cluster0.l3vkr4h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(express.static(path.join(__dirname, "docs")));
app.use(express.json());

const cors = require("cors");
app.use(cors()); // 쓸때만 켜두기ㅡㅡ

const PORT = 5000;

//로그인 구현
app.post("/register", async (req, res) => {
  const { id, pw } = req.body;
  const exists = await User.findOne({ id });
  if (exists) return res.status(400).json({ message: "0" });

  const hashed = await bcrypt.hash(pw, 10);
  const user = new User({ id, pw: hashed, desc: "안녕하세요." });
  await user.save();
  res.json({ message: "1" });
});

app.post("/login", async (req, res) => {
  const { id, pw } = req.body;
  const user = await User.findOne({ id });
  if (!user) return res.status(400).json({ message: "-1" });

  const match = await bcrypt.compare(pw, user.pw);
  if (!match) return res.status(400).json({ message: "-2" });
  const desc = user.desc;
  const pf = user.profileImage;
  const lang = user.country;
  const light = user.light;
  const TP = user.translatepreview

  res.json({ message: "2", desc, pf, lang, light, TP });
});

app.post("/get_friends", async (req, res) => {
  const { id } = req.body;
  const user = await User.findOne({ id });
  if (!user) return res.status(400).json({ message: "-1" });

  // 친구들의 정보를 몽땅 불러오기
  const friends = await User.find({ id: { $in: user.friends } });
  const friendData = friends.map((friend) => ({
    id: friend.id,
    desc: friend.desc,
    pf: friend.profileImage,
    lang: friend.country,
  }));

  res.json({ message: "2", friends: friendData });
});

app.post("/get_groups", async (req, res) => {
  const { id } = req.body;

  // 유저 존재 여부 확인
  const user = await User.findOne({ id });
  if (!user) return res.status(400).json({ message: "-1" });

  // 유저가 참여 중인 그룹챗 불러오기
  const groupChats = await GroupChatting.find({ partners: id });

  // 필요한 데이터만 추려서 보내기
  const groupData = groupChats.map((group) => ({
    groupId: group._id,           // 그룹 고유 ID
    members: group.partners,      // 멤버 목록
    name: group.title
  }));

  res.json({ message: "2", groups: groupData });
});

app.post("/add_friend", async (req, res) => {
  const { id1, id2 } = req.body;
  const user1 = await User.findOne({ id: id1 });
  const user2 = await User.findOne({ id: id2 });
  if (!user1 || !user2) return res.status(400).json({ message: "-1" });
  if (user1.friends.includes(id2))
    return res.status(400).json({ message: "-2" });
  user1.friends.push(id2);
  await user1.save();
  res.json({ message: "2" });
});

app.post("/remove_friend", async (req, res) => {
  const { id1, id2 } = req.body;

  // 유저 찾기
  const user1 = await User.findOne({ id: id1 });
  const user2 = await User.findOne({ id: id2 });

  // 유저가 존재하지 않을 경우
  if (!user1 || !user2) return res.status(400).json({ message: "-1" }); // 유효하지 않은 유저

  // 친구 목록에 없다면
  if (!user1.friends.includes(id2)) {
    return res.status(400).json({ message: "-2" }); // 이미 없는 친구
  }

  // 친구 삭제
  user1.friends = user1.friends.filter((friendId) => friendId !== id2);
  await user1.save();

  res.json({ message: "2" }); // 성공
});

app.post("/edit_profile", async (req, res) => {
  const { id, mes, pf, country, light, TP } = req.body;
  const user = await User.findOne({ id });
  if (!user) return res.status(400).json({ message: "-1" });
  user.desc = mes;
  user.profileImage = pf;
  user.country = country;
  user.light = light; // 🌟 추가!
  user.translatepreview = TP;
  await user.save();
  res.status(200).json({ message: "1" });
});

app.post("/get_chattings", async (req, res) => {
  const { id1, id2 } = req.body;

  // 채팅 찾기 (양방향)
  const chatting = await Chatting.findOne({
    $or: [
      { partner1: id1, partner2: id2 },
      { partner1: id2, partner2: id1 },
    ],
  });

  // 상대방(=partner)의 정보 불러오기
  const partnerUser = await User.findOne({ id: id2 });
  let partnerLanguage = partnerUser
    ? partnerUser.country || "unknown"
    : "unknown";

  // 채팅방이 없으면 새로 생성 + partner 언어만 응답
  if (!chatting) {
    const newChatting = new Chatting({
      partner1: id1,
      partner2: id2,
      chattings: [],
    });
    await newChatting.save();

    return res.json({
      message: "2",
      chattings: [],
      partnerLanguage: partnerLanguage,
    });
  }

  // 기존 채팅방이 있다면 채팅 + partner 언어 같이 응답
  res.json({
    message: "2",
    chattings: chatting.chattings,
    partnerLanguage: partnerLanguage,
  });
});

app.post("/get_groupchat_history", async (req, res) => {
  const { groupId } = req.body;

  // 그룹채팅방 찾기
  const group = await GroupChatting.findById(groupId);
  if (!group) return res.status(400).json({ message: "-1" }); // 그룹이 없음

  // 그룹 멤버들의 정보 가져오기
  const members = await User.find({ id: { $in: group.partners } });
  const memberInfo = members.map((user) => ({
    id: user.id,
    desc: user.desc,
    pf: user.profileImage,
    lang: user.country || "unknown",
  }));

  res.json({
    message: "2",
    chattings: group.chattings,
    members: memberInfo,
    title: group.title, // 그룹 타이틀 추가
  });
});

app.post("/create_groupchat", async (req, res) => {
  const { title, maker } = req.body;

  if (!title || !maker) {
    return res.status(400).json({ message: "-1", error: "Invalid data" });
  }

  try {
    const newGroup = new GroupChatting({
      title,
      partners: [maker],
      chattings: [], // 기본값으로 빈 배열 가능
    });

    const savedGroup = await newGroup.save();

    res.json({
      message: "1",
      groupId: savedGroup._id,
    });
  } catch (error) {
    console.error("그룹채팅 생성 오류!", error);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

// POST /join_groupchat
app.post("/join_groupchat", async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    return res.status(400).json({ message: "-1", error: "Invalid input" });
  }

  try {
    const group = await GroupChatting.findByIdAndUpdate(
      groupId,
      { $addToSet: { partners: userId } }, // 중복 없이 추가!!
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "-1", error: "Group not found" });
    }

    res.json({
      message: "1", // 성공
      updatedPartners: group.partners,
    });
  } catch (err) {
    console.error("그룹 참여 에러:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

// POST /leave_groupchat
app.post("/leave_groupchat", async (req, res) => {
  const { groupId, userId } = req.body;

  // 유효성 검사
  if (!groupId || !userId) {
    return res.status(400).json({ message: "-1", error: "Invalid input" });
  }

  try {
    // 그룹에서 해당 userId를 제거함!
    const group = await GroupChatting.findByIdAndUpdate(
      groupId,
      { $pull: { partners: userId } }, // ✂️ 삭제
      { new: true } // 업데이트된 문서 반환
    );

    if (!group) {
      return res.status(404).json({ message: "-1", error: "Group not found" });
    }

    res.json({
      message: "1", // 성공!
      updatedPartners: group.partners,
    });
  } catch (err) {
    console.error("그룹 나가기 에러:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});


app.post("/ban_user", async (req, res) => {
  const { id, reason } = req.body;
  const exists = await Ban.findOne({ id });
  if (exists) return res.status(400).json({ message: "0" });
  const banned = new Ban({ id, reason });
  await banned.save();
  res.json({ message: "1" });
});

app.post("/ban_check", async (req, res) => {
  const { id } = req.body;
  const exists = await Ban.findOne({ id });
  if (exists) return res.status(400).json({ message: "1" });
  res.json({ message: "0" });
});

app.post("/translation", async (req, res) => {
  const { country1, country2, content, note } = req.body;

  try {
    const result = await translation(country1, country2, content, note);
    res.json(result);
  } catch (err) {
    console.error("Translation API failed:", err.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.post("/nova_response", async (req, res) => {
  const {messages} = req.body;
  try {
    const result = await nova_response(messages);
    res.json(result);
  } catch (err) {
    console.error("AI API failed:", err.message);
    res.status(500).json({ error: "AI response failed" });
  }
})

app.post("/get_ainova_history", async (req, res) => {
  const { id } = req.body;
  
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json({ message: "-1", error: "User not found" });
    }

    res.json({
      message: "2",
      ainovaHistory: user.ainovaHistory || []
    });
  } catch (err) {
    console.error("AI History 조회 오류:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

app.post("/update_ainova_history", async (req, res) => {
  const { id, ainovaHistory } = req.body;
  
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json({ message: "-1", error: "User not found" });
    }

    user.ainovaHistory = ainovaHistory;
    await user.save();

    res.json({ message: "2" });
  } catch (err) {
    console.error("AI History 업데이트 오류:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

app.post("/get_important_article", async (req, res) => {
  try {
    const latestImportant = await DevelopVoice.findOne({ important: true })
      .sort({ date: -1 }) // 최신순 정렬
      .exec();

    if (!latestImportant) {
      return res.status(404).json({ message: "-1", error: "No important article found" });
    }

    const preview =
      latestImportant.content.length > 15
        ? latestImportant.content.slice(0, 15) + "..."
        : latestImportant.content;

    res.json({
      id: latestImportant._id,
      title: latestImportant.title,
      contentPreview: preview
    });
  } catch (err) {
    console.error("중요 공지 가져오기 오류:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

app.post("/get_article_content", async (req, res) => {
  const { id } = req.body;

  try {
    const article = await DevelopVoice.findById(id).exec();

    if (!article) {
      return res.status(404).json({ message: "-1", error: "Article not found" });
    }

    res.json({
      title: article.title,
      content: article.content,
      date: article.date.toISOString() // 혹은 toLocaleString()으로도 바꿀 수 있음
    });
  } catch (err) {
    console.error("전체 글 조회 오류:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

app.post("/get_all_articles_meta", async (req, res) => {
  try {
    const articles = await DevelopVoice.find({}, { title: 1, date: 1, important: 1 })
      .sort({ date: -1 })
      .exec();

    const result = articles.map((article) => ({
      id: article._id,
      title: article.title,
      date: article.date,
      important: article.important
    }));

    res.json(result);
  } catch (err) {
    console.error("전체 공지 목록 조회 오류:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});

app.post("/submit_contact", async (req, res) => {
  const { user, content, email } = req.body;

  // 간단한 유효성 검사
  if (!user || !content || !email) {
    return res.status(400).json({ message: "-1", error: "필수 항목 누락" });
  }

  try {
    const newContact = new Contact({
      user,
      content,
      email,
      date: new Date()
    });

    await newContact.save();

    res.json({ message: "1", success: true });
  } catch (err) {
    console.error("문의 저장 중 오류:", err);
    res.status(500).json({ message: "-1", error: "Server error" });
  }
});


async function translation(country1, country2, content, note) {
  const url = "https://api.mistral.ai/v1/agents/completions";
  const api_key = "wHvwPFXbhW6BKFso2jWkjEU8VUjNC5Mh";
  const headers = {
    Authorization: `Bearer ${api_key}`,
    "Content-Type": "application/json",
  };

  const messages = [
    {
      role: "user",
      content: `
        Can you translate to ${country2} that is spoken with ${country1}?
        Note: ${note}
        Content:
        ${content}
      `,
    },
  ];

  const data = {
    messages,
    response_format: { type: "text" },
    agent_id: "ag:edad7170:20250128:nova-translator:9b167e24",
  };

  try {
    const response = await axios.post(url, data, { headers });

    // content만 추출
    const translatedText = response.data.choices[0].message.content;
    console.log("번역 결과:", translatedText);

    return translatedText;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

async function nova_response(messages) {
  const url = "https://api.mistral.ai/v1/agents/completions";
  const api_key = "wHvwPFXbhW6BKFso2jWkjEU8VUjNC5Mh";
  const headers = {
    Authorization: `Bearer ${api_key}`,
    "Content-Type": "application/json",
  };

  const data = {
    messages,
    response_format: { type: "text" },
    agent_id: "ag:edad7170:20250906:nova-chatbot:04feab79",
  };

  try {
    const response = await axios.post(url, data, { headers });

    // content만 추출
    const translatedText = response.data.choices[0].message.content;
    console.log("AI답변 결과:", translatedText);

    return translatedText;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

async function send_chatting(id1, id2, content, method, foreign_ver) {
  console.log(id1,id2,content,method)
  if (method === 0) {
    const chatting = await Chatting.findOne({
      $or: [
        { partner1: id1, partner2: id2 },
        { partner1: id2, partner2: id1 },
      ],
    });

    if (!chatting) {
      console.log("Wrong Chatting");
      return;
    }

    chatting.chattings.push({ id: id1, content, foreign_ver });
    await chatting.save();
  } else if (method === 1) {
    const groupChat = await GroupChatting.findById(id2);

    if (!groupChat) {
      console.log("Wrong GroupChat");
      return;
    }
  
    // 메시지 저장
    groupChat.chattings.push({ id: id1, content, foreign_ver });
    await groupChat.save();
  }
}
// ADMIN PANNEL
app.post("/api/developvoice", async (req, res) => {
  const { title, content, important, key } = req.body;
  if (key == "ADMIN0011992") {
    try {

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
      }

      const newPost = new DevelopVoice({
        title,
        content,
        date: new Date(),
        important: important || false,
      });

      await newPost.save();
      res.status(201).json({ message: "Announcement successfully posted!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
});

server.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("chatting", (data) => {
    console.log(data);
    if (data.method === 1) {
      send_chatting(data.from, data.to, data.content, data.method, data.my_lang, data.foreign_ver);
    } else {
      send_chatting(data.from, data.to, data.content, data.method, data.foreign_ver);
    }    
    io.emit("chatting", data);
  });
});
