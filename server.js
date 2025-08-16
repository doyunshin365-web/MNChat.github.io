const express = require('express'); 
const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcrypt');
const path = require('path');
const http = require('http');
const User = require('./public/models/Users');
const Chatting = require('./public/models/Chattings');
const Ban = require('./public/models/Banned');
const app = express();
const server = http.createServer(app);

const socketIO = require('socket.io');
const io = socketIO(server);  

mongoose.connect('mongodb+srv://doyunshin365:mNCNCCIPky88bW8b@cluster0.l3vkr4h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const PORT = 5000;

//로그인 구현
app.post('/register', async (req, res) => {
  const { id, pw } = req.body;
  const exists = await User.findOne({ id });
  if (exists) return res.status(400).json({ message: "0" });

  const hashed = await bcrypt.hash(pw, 10);
  const user = new User({ id, pw: hashed, desc: '안녕하세요.' });
  await user.save();
  res.json({message: "1"});
});

app.post('/login', async (req, res) => {
  const {id, pw} = req.body;
  const user = await User.findOne({id});
  if (!user) return res.status(400).json({message: "-1"});

  const match = await bcrypt.compare(pw, user.pw);
  if (!match) return res.status(400).json({message: "-2"});
  const desc = user.desc;
  const pf = user.profileImage;
  const lang = user.country;

  res.json({ message:'2', desc, pf, lang});
});

app.post('/get_friends', async (req, res) => {
  const {id} = req.body;
  const user = await User.findOne({id});
  if (!user) return res.status(400).json({message: "-1"});

  // 친구들의 정보를 몽땅 불러오기
  const friends = await User.find({ id: { $in: user.friends } });
  const friendData = friends.map(friend => ({
    id: friend.id,
    desc: friend.desc,
    pf: friend.profileImage,
    lang: friend.country
  }));

  res.json({message: "2", friends: friendData});
});

app.post('/add_friend', async (req, res) => {
  const {id1, id2} = req.body;
  const user1 = await User.findOne({id: id1});
  const user2 = await User.findOne({id: id2});
  if (!user1 || !user2) return res.status(400).json({message: "-1"});
  if (user1.friends.includes(id2)) return res.status(400).json({message: "-2"});
  user1.friends.push(id2);
  await user1.save();
  res.json({message: "2"});
});

app.post('/remove_friend', async (req, res) => {
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
  user1.friends = user1.friends.filter(friendId => friendId !== id2);
  await user1.save();

  res.json({ message: "2" }); // 성공
});

app.post('/edit_profile', async (req, res) => {
  const {id, mes, pf, country} = req.body;
  const user = await User.findOne({id});
  if (!user) return res.status(400).json({message: "-1"});
  user.desc = mes;
  user.profileImage = pf;
  user.country = country;
  await user.save();
  res.status(200).json({message: "1"});
});

app.post('/get_chattings', async (req, res) => {
  const { id1, id2 } = req.body;

  // 채팅 찾기 (양방향)
  const chatting = await Chatting.findOne({
    $or: [
      { partner1: id1, partner2: id2 },
      { partner1: id2, partner2: id1 }
    ]
  });

  // 상대방(=partner)의 정보 불러오기
  const partnerUser = await User.findOne({ id: id2 });
  let partnerLanguage = partnerUser ? partnerUser.country || 'unknown' : 'unknown';

  // 채팅방이 없으면 새로 생성 + partner 언어만 응답
  if (!chatting) {
    const newChatting = new Chatting({
      partner1: id1,
      partner2: id2,
      chattings: []
    });
    await newChatting.save();

    return res.json({
      message: "2",
      chattings: [],
      partnerLanguage: partnerLanguage
    });
  }

  // 기존 채팅방이 있다면 채팅 + partner 언어 같이 응답
  res.json({
    message: "2",
    chattings: chatting.chattings,
    partnerLanguage: partnerLanguage
  });
});

app.post('/ban_user', async (req, res) => {
  const {id, reason} = req.body;
  const exists = await Ban.findOne({ id });
  if (exists) return res.status(400).json({ message: "0" });
  const banned = new Ban({ id, reason });
  await banned.save();
  res.json({message: "1"});
});

app.post('/ban_check', async (req, res) => {
  const {id} = req.body;
  const exists = await Ban.findOne({ id });
  if (exists) return res.status(400).json({ message: "1" });
  res.json({message:"0"})
});

async function send_chatting(id1, id2, content) {
  const chatting = await Chatting.findOne({
    $or: [
      { partner1: id1, partner2: id2 },
      { partner1: id2, partner2: id1 }
    ]
  });

  if (!chatting) {
    console.log("Wrong Chatting");
    return;
  }

  chatting.chattings.push({ id: id1, content });
  await chatting.save();
}

app.post('/translation', async (req, res) => {
  const { country1, country2, content } = req.body;

  try {
    const result = await translation(country1, country2, content);
    res.json(result);
  } catch (err) {
    console.error("Translation API failed:", err.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

async function translation(country1, country2, content) {
  const url = "https://api.mistral.ai/v1/agents/completions";
  const api_key = 'wHvwPFXbhW6BKFso2jWkjEU8VUjNC5Mh';
  const headers = {
    Authorization: `Bearer ${api_key}`,
    'Content-Type': 'application/json'
  };

  const messages = [
    {
      role: 'user',
      content: `
        Can you translate to ${country2} that is spoken with ${country1}?
        Content:
        ${content}
      `
    }
  ];

  const data = {
    messages,
    response_format: { type: "text" },
    agent_id: "ag:edad7170:20250128:nova-translator:9b167e24"
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

server.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});

io.on('connection', (socket) => {
    socket.on('chatting', (data) => {
      send_chatting(data.from, data.to, data.content);
      io.emit('chatting', data);
    });
});